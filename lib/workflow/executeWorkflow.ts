import "server-only"
import prisma from "../prisma"
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow"
import { ExecutionPhase } from "@prisma/client"
import { AppNode } from "@/types/appNode"
import { TaskRegistry } from "./task/registry"
import { waitFor } from "../helper/waitFor"
import { ExecutorRegistry } from "./executor/executorRegistry"

export const ExecuteWorkflow = async (executionId: string) => {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: {
            workflow: true,
            phases: true
        }
    })

    if (!execution) throw new Error("Execution not found")

    // Setup execution environment
    const environment = { phases: {} }

    // Initialize workflow execution
    await initializeWorkflowExecution(execution.id, execution.workflowId)
    // Initialize Phases status
    await initializePhaseStatuses(execution)

    let creditsConsumed = 0
    let executionFailed = false;
    for (const phase of execution.phases) {
        // Consuming credits
        // Execute phase  
        const phaseExecution = await executeWorkflowPhase(phase)
        if (!phaseExecution.success) {
            executionFailed = true
            break; // do not process next phases if one fails
        }
    }

    // finalize execution
    await finalizeExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)
    // Cleanup execution environment
}


async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    })

    await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId
        }
    })
}

async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    })
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
    const startedAt = new Date()
    const node = JSON.parse(phase.node) as AppNode

    await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
            startedAt,
            status: ExecutionPhaseStatus.RUNNING
        }
    })

    const creditsRequired = TaskRegistry[node.data.type].credits
    console.log(`Executing phase: ${phase.name} with ${creditsRequired} credits`)

    // TODO: Decrease credits from user account

    // Execute phase execution
    await waitFor(1000)

    const success = await executePhase(phase, node)
    await finalizePhase(phase.id, success)

    return { success }
}

async function executePhase(phase: ExecutionPhase, node: AppNode): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn) return false

    return await runFn()
}


async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED
    await prisma.executionPhase.update({
        where: { id: phaseId },
        data: {
            status: finalStatus,
            completedAt: new Date()
        }
    })
}

async function finalizeExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED

    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    })

    await prisma.workflow.update({
        where: { id: workflowId, lastRunId: executionId },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch((err) => {

    })
}
