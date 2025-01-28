"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetUserPurchaseHistory = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized Access");

    const purchases = await prisma.userPurchase.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return purchases;
  } catch (err) {
    console.error(err);
  }
};
