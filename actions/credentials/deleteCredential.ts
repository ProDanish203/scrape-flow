"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DeleteCredential = async (name: string) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized access");

    const result = await prisma.credential.delete({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });

    if (!result) throw new Error("Failed to delete credential");

    revalidatePath("/credentials");
    return result;
  } catch (err) {
    console.error(err);
  }
};
