"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowExecutionWithPhases = async (executionId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthroized");

    const workflowExecution = await prisma.workflowExecution.findUnique({
      where: {
        id: executionId,
        userId,
      },
      include: {
        phases: {
          orderBy: {
            number: "asc",
          },
        },
      },
    });

    if (!workflowExecution) throw new Error("Workflow execution not found");

    return workflowExecution;
  } catch (err) {
    console.error(err);
  }
};
