"use server"

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow({ workflowId, flowDefintion }: { workflowId: string; flowDefintion?: string }) {
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
    console.log("Execution Plan: ", executionPlan)
}