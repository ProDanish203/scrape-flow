"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export const UpdateWorkflowCron = async ({
  workflowId,
  cron,
}: {
  workflowId: string;
  cron: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized Action");
  try {
    const interval = parser.parseExpression(cron, { utc: true });
    if (!interval) throw new Error("Invalid Cron Expression");

    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
  revalidatePath("/workflows");
};
