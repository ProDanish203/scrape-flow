"use server"
import { auth } from '@clerk/nextjs/server';
import { createWorkflowSchema, createWorkflowSchemaType } from './../../schema/workflow';
import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';
import { redirect } from 'next/navigation';

export const CreateWorkflow = async (form: createWorkflowSchemaType) => {
    try {

        const { success, data } = createWorkflowSchema.safeParse(form);
        if (!success) throw new Error("Invalid form data");
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized");

        const result = await prisma.workflow.create({
            data: {
                ...data,
                userId,
                status: WorkflowStatus.DRAFT,
                definition: "TODO"
            }
        })
        if (!result) throw new Error("Failed to create workflow abc");

        redirect(`/workflow/editor/${result.id}`);
    } catch (err) {
        console.error(err);
    }
}