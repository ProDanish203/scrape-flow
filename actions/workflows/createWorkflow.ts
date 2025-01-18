"use server"
import { auth } from '@clerk/nextjs/server';
import { createWorkflowSchema, createWorkflowSchemaType } from './../../schema/workflow';
import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';
import { redirect } from 'next/navigation';
import { AppNode } from '@/types/appNode';
import { Edge } from '@xyflow/react';
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import { revalidatePath } from 'next/cache';

export const CreateWorkflow = async (form: createWorkflowSchemaType) => {
    let workflowId: string;
    try {
        const { success, data } = createWorkflowSchema.safeParse(form);
        if (!success) throw new Error("Invalid form data");
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorized");

        const initialFlow: {
            nodes: AppNode[], edges: Edge[]
        } = { nodes: [], edges: [] };

        initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))

        const result = await prisma.workflow.create({
            data: {
                ...data,
                userId,
                status: WorkflowStatus.DRAFT,
                definition: JSON.stringify(initialFlow)
            }
        })
        if (!result) throw new Error("Failed to create workflow abc");
        revalidatePath("/workflows");
        workflowId = result.id;

    } catch (err: any) {
        console.error(err);
    }
    redirect(`/workflow/editor/${workflowId!}`);
}