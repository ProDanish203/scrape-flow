"use server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export const DeleteWorkflow = async (workflowId: string) => {
    try {
        const { userId } = await auth()
        if (!userId)
            throw new Error("Unauthorized Action")

        const deletedWorkflow = await prisma.workflow.delete({
            where: {
                id: workflowId,
                userId,
            },
        })

        revalidatePath("/workflows")
        return deletedWorkflow
    } catch (err) {
        console.error(err)
    }
}