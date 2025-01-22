"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const UpdateWorkflow = async ({
  workflowId,
  definition,
}: {
  workflowId: string;
  definition: string;
}) => {
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
      throw new Error("Workflow is not a draft");

    const updatedWorkflow = await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        definition,
      },
    });
    revalidatePath(`/workflows/${workflowId}`);
    revalidatePath(`/workflows`);
    return updatedWorkflow;
  } catch (err) {
    console.log("Error: ", err);
  }
};
