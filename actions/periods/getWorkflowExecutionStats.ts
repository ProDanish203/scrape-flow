"use server";

import { PeriodsToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export const GetWorkflowExecutionStats = async (period: Period) => {
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
      },
    });

    const stats: Stats = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    })
      .map((date) => format(date, "yyyy-MM-dd"))
      .reduce((acc, date) => {
        acc[date] = {
          success: 0,
          failed: 0,
        };
        return acc;
      }, {} as Stats);

    executions.forEach((execution) => {
      const date = format(execution.startedAt!, "yyyy-MM-dd");
      if (execution.status === WorkflowExecutionStatus.COMPLETED) {
        stats[date].success += 1;
      } else if (execution.status === WorkflowExecutionStatus.FAILED) {
        stats[date].failed += 1;
      }
    });

    const result = Object.entries(stats).map(([date, info]) => ({
      date,
      ...info,
    }));

    return result;
  } catch (err) {
    console.error(err);
  }
};
