"use server";

import { PeriodsToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export const GetCreditsUsageInPeriod = async (period: Period) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const dateRange = PeriodsToDateRange(period);
    const executionPhases = await prisma.executionPhase.findMany({
      where: {
        userId,
        startedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
        status: {
          in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
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

    executionPhases.forEach((phase) => {
      const date = format(phase.startedAt!, "yyyy-MM-dd");
      if (phase.status === ExecutionPhaseStatus.COMPLETED) {
        stats[date].success += phase.creditsConsumed || 0;
      } else if (phase.status === ExecutionPhaseStatus.FAILED) {
        stats[date].failed += phase.creditsConsumed || 0;
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
