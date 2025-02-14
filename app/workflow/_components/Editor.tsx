"use client";
import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowEditor } from "./FlowEditor";
import { TopBar } from "./topbar/TopBar";
import { TaskMenu } from "./TaskMenu";
import { FlowValidationProvider } from "@/store/FlowValidationProvider";
import { WorkflowStatus } from "@/types/workflow";

interface Props {
  workflow: Workflow;
}

export const Editor: React.FC<Props> = ({ workflow }) => {
  return (
    <FlowValidationProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <TopBar
            title="Workflow Editor"
            subTitle={workflow.name}
            workflowId={workflow.id}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProvider>
  );
};
