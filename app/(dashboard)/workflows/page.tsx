import { UserWorkflowsSkeleton } from "./_components/UserWorkflowsSkeleton";
import { UserWorkflows } from "./_components/UserWorkflows";
import React, { Suspense } from "react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";

const WorkflowPage = () => {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="xs:text-3xl text-2xl font-bold">Workflows</h1>
          <p className="max-xs:text-sm text-muted-foreground">
            Manage your workflows
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create Workflow" />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
};

export default WorkflowPage;
