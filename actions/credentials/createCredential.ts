"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const CreateCredential = async (form: createCredentialSchemaType) => {
  try {
    const { success, data } = createCredentialSchema.safeParse(form);
    if (!success) throw new Error("Invalid form data");
    const { name, value } = data;

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized access");

    const encryptedValue = symmetricEncrypt(value);

    const result = await prisma.credential.create({
      data: {
        userId,
        name,
        value: encryptedValue,
      },
    });

    if (!result) throw new Error("Failed to create credential");

    revalidatePath("/credentials");
    return result;
  } catch (err) {
    console.error(err);
  }
};
