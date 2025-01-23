"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const UnpublishWorkflow = async (workflowId: string) => {
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

    if (workflow.status !== WorkflowStatus.PUBLISHED)
      throw new Error("Workflow is not in published state");

    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        status: WorkflowStatus.DRAFT,
        executionPlan: null,
        creditsCost: 0,
      },
    });

    revalidatePath(`/workflow/editor/${workflowId}`);
    revalidatePath(`/workflows`);
  } catch (err: any) {
    console.error(`Failed to unpublish workflow: ${err.message}`);
  }
};
