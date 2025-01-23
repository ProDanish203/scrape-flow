"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { CalculateWorkflowCredits } from "@/lib/workflow/helper";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  workflowId,
  flowDefintion,
}: {
  workflowId: string;
  flowDefintion: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized action");

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId,
      },
    });

    if (!workflow) throw new Error("Workflow not found");

    if (workflow.status !== WorkflowStatus.DRAFT)
      throw new Error("Workflow is not in draft state");

    const flow = JSON.parse(flowDefintion);
    const { error, executionPlan } = FlowToExecutionPlan(
      flow.nodes,
      flow.edges
    );

    if (error) throw new Error("Flow definition is invalid");

    if (!executionPlan) throw new Error("Failed to generate execution plan");

    const creditsCost = CalculateWorkflowCredits(flow.nodes);
    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        definition: flowDefintion,
        executionPlan: JSON.stringify(executionPlan),
        creditsCost,
        status: WorkflowStatus.PUBLISHED,
      },
    });

    revalidatePath(`/workflow/editor/${workflowId}`);
    revalidatePath(`/workflows`);
  } catch (err: any) {
    console.error(`Failed to publish workflow: ${err.message}`);
  }
}
