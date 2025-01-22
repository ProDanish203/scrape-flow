import "server-only";
import prisma from "../prisma";
import {
    ExecutionPhaseStatus,
    WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/executorRegistry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser } from "puppeteer";
import { revalidatePath } from "next/cache";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export const ExecuteWorkflow = async (executionId: string) => {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
        },
        include: {
            workflow: true,
            phases: true,
        },
    });

    if (!execution) throw new Error("Execution not found");
    const edges = JSON.parse(execution.definition).edges as Edge[];

    // Setup execution environment
    const environment = { phases: {} };

    // Initialize workflow execution
    await initializeWorkflowExecution(execution.id, execution.workflowId);
    // Initialize Phases status
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {
        // TODO: Consuming credits
        // Execute phase
        const phaseExecution = await executeWorkflowPhase(
            phase,
            environment,
            edges,
            execution.userId
        );
        creditsConsumed += phaseExecution.creditsConsumed
        if (!phaseExecution.success) {
            executionFailed = true;
            break; // do not process next phases if one fails
        }
    }

    // finalize execution
    await finalizeExecution(
        executionId,
        execution.workflowId,
        executionFailed,
        creditsConsumed
    );

    // Cleanup execution environment
    await cleanupEnvironment(environment);

    revalidatePath("/workflow/runs");
};

async function initializeWorkflowExecution(
    executionId: string,
    workflowId: string
) {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        },
    });

    await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
        },
    });
}

async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id),
            },
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        },
    });
}

async function executeWorkflowPhase(
    phase: ExecutionPhase,
    environment: Environment,
    edges: Edge[],
    userId: string
) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;

    const logCollector = createLogCollector();

    setupEnvironmentForPhase(node, edges, environment);

    await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
            startedAt,
            status: ExecutionPhaseStatus.RUNNING,
            inputs: JSON.stringify(environment.phases[node.id].inputs),
        },
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    let success = await decrementUserCredits(
        userId,
        creditsRequired,
        logCollector
    );
    const creditsConsumed = success ? creditsRequired : 0;
    if (success) {
        // execute phase if credits are sufficient
        success = await executePhase(phase, node, environment, logCollector);
    }

    const outputs = environment.phases[node.id].outputs;
    await finalizePhase(
        phase.id,
        success,
        outputs,
        logCollector,
        creditsConsumed
    );

    return { success, creditsConsumed };
}

async function executePhase(
    phase: ExecutionPhase,
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) return false;

    const executionEnvironment: ExecutionEnvironment<any> =
        createExecutionEnvironment(node, environment, logCollector);

    return await runFn(executionEnvironment);
}

async function finalizePhase(
    phaseId: string,
    success: boolean,
    outputs: any,
    logCollector: LogCollector,
    creditsConsumed: number
) {
    const finalStatus = success
        ? ExecutionPhaseStatus.COMPLETED
        : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: { id: phaseId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map((log) => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level,
                    })),
                },
            },
        },
    });
}

async function finalizeExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number
) {
    const finalStatus = executionFailed
        ? WorkflowExecutionStatus.FAILED
        : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed,
        },
    });

    await prisma.workflow
        .update({
            where: { id: workflowId, lastRunId: executionId },
            data: {
                lastRunStatus: finalStatus,
            },
        })
        .catch((err) => {
            console.error(`Failed to update workflow status: ${err}`);
        });
}

function setupEnvironmentForPhase(
    node: AppNode,
    edges: Edge[],
    environment: Environment
) {
    environment.phases[node.id] = { inputs: {}, outputs: {} };
    // now populate inputs from node
    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // If the value is not provided means it is connected to an output of another node
        const connectedEdge = edges.find(
            (edge) => edge.target === node.id && edge.targetHandle === input.name
        );

        if (!connectedEdge) {
            console.error(`Input ${input.name} not connected for node ${node.id}`);
            continue;
        }

        const outputValue =
            environment.phases[connectedEdge.source]?.outputs[
            connectedEdge.sourceHandle!
            ];

        if (!outputValue) {
            console.error(`Output value not found for edge ${connectedEdge.id}`);
            continue;
        }
        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}

function createExecutionEnvironment(
    node: AppNode,
    environment: Environment,
    logCollector: LogCollector
): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],

        setOutput: (name: string, value: string) =>
            (environment.phases[node.id].outputs[name] = value),

        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),

        getPage: () => environment.page,
        setPage: (page: any) => (environment.page = page),

        log: logCollector,
    };
}

async function cleanupEnvironment(environment: Environment) {
    if (environment.browser) {
        await environment.browser
            .close()
            .catch((err) => console.log(`Failed to close browser: ${err}`));
    }
}

async function decrementUserCredits(
    userId: string,
    credits: number,
    logCollector: LogCollector
) {
    try {
        await prisma.userBalance.update({
            where: { userId: userId, credits: { gte: credits } },
            data: {
                credits: {
                    decrement: credits,
                },
            },
        });
        return true;
    } catch (err) {
        logCollector.error(`Insufficient balance`);
        return false;
    }
}
