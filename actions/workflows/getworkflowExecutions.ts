"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetworkflowExecutions = async (workflowId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return prisma.workflowExecution.findMany({
      where: {
        workflowId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.log(err);
  }
};
