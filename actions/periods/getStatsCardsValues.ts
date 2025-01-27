"use server";

import { PeriodsToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export const GetStatsCardsValues = async (period: Period) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const dateRange = PeriodsToDateRange(period);
    const executions = await prisma.workflowExecution.findMany({
      where: {
        userId,
        startedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
        status: {
          in: [
            WorkflowExecutionStatus.COMPLETED,
            WorkflowExecutionStatus.FAILED,
          ],
        },
      },
      select: {
        creditsConsumed: true,
        phases: {
          where: {
            creditsConsumed: {
              not: null,
            },
          },
          select: { creditsConsumed: true },
        },
      },
    });

    const stats = {
      workflowExecution: executions.length,
      creditsConsumed: executions.reduce(
        (acc, curr) => acc + (curr.creditsConsumed || 0),
        0
      ),
      phasesExecution: executions.reduce(
        (acc, curr) => acc + curr.phases.length,
        0
      ),
    };

    return stats;
  } catch (err) {
    console.error(err);
  }
};
