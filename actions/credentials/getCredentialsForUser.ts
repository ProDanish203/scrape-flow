"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetCredentialsForUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthroized action");

    const credentials = await prisma.credential.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return credentials;
  } catch (e) {
    console.error(e);
  }
};
