"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const RemoveWorkflowCron = async (workflowId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized Action");
  try {
    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        cron: null,
        nextRunAt: null,
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message);
  }
  revalidatePath("/workflows");
};
