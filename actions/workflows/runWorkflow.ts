"use server"

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow({ workflowId, flowDefintion }: { workflowId: string; flowDefintion?: string }) {
    let executionId: string
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized action")

        if (!workflowId) throw new Error("Workflow ID is required")
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId
            }
        })

        if (!workflow) throw new Error("Workflow not found")
        let executionPlan: WorkflowExecutionPlan

        if (!flowDefintion) throw new Error("Flow definition is not defined")

        const flow = JSON.parse(flowDefintion)
        const result = FlowToExecutionPlan(flow.nodes, flow.edges)
        if (result.error)
            throw new Error("Flow definition is invalid")
        if (!result.executionPlan) throw new Error("Execution plan is not generated")

        executionPlan = result.executionPlan

        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionTrigger.MANUAL,
                phases: {
                    create: executionPlan.flatMap((phase) => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId,
                                status: ExecutionPhaseStatus.CREATED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label
                            }
                        })
                    })
                }
            },
            select: {
                id: true,
                phases: true,

            }
        })

        if (!execution) throw new Error("Failed to execute workflow")
        ExecuteWorkflow(execution.id)
        executionId = execution.id
    } catch (err) {
        console.error(err)
    }

    redirect(`/workflow/runs/${workflowId}/${executionId!}`)
}