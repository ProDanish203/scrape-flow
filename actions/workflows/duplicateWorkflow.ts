"use server";

import prisma from "@/lib/prisma";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DuplicateWorkflow = async (form: duplicateWorkflowSchemaType) => {
  try {
    const { success, data } = duplicateWorkflowSchema.safeParse(form);
    if (!success) throw new Error("Invalid form data");
    const { name, description, workflowId } = data;

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Action");

    const sourceWorkflow = await prisma.workflow.findUnique({
      where: { id: workflowId, userId },
    });
    if (!sourceWorkflow) throw new Error("Source Workflow not found");

    const result = await prisma.workflow.create({
      data: {
        userId,
        name,
        description,
        status: WorkflowStatus.DRAFT,
        definition: sourceWorkflow.definition,
      },
    });

    if (!result) throw new Error("Failed to duplicate workflow");
    revalidatePath("/workflows");
    return result;
  } catch (err) {
    console.error(err);
  }
};
