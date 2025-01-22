"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetAvalailableCredits = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Access");

    const balance = await prisma.userBalance.findUnique({ where: { userId } });

    if (!balance) return -1;
    return balance.credits;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
