import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { Editor } from "../../_components/Editor";

const WorkflowEditorPage = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  const { workflowId } = await params;
  const { userId } = await auth();
  if (!userId) return <div>Unauthorized access</div>;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });
  if (!workflow) return <div>Worflow not found</div>;

  return <Editor workflow={workflow} />;
};

export default WorkflowEditorPage;
