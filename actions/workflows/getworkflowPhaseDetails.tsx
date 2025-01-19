"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetWorkflowPhaseDetails = async (phaseId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const phaseDetails = await prisma.executionPhase.findUnique({
      where: {
        id: phaseId,
        execution: {
          userId,
        },
      },
      include: {
        logs: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!phaseDetails) throw new Error("Phase not found");

    return phaseDetails;
  } catch (err) {
    console.error(err);
  }
};
