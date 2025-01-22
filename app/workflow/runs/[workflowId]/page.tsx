import React, { Suspense } from "react";
import { TopBar } from "../../_components/topbar/TopBar";
import { GetworkflowExecutions } from "@/actions/workflows/getworkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { ExecutionTable } from "./_components/ExecutionTable";

const WorkflowHistoryPage = async ({
  params,
}: {
  params: { workflowId: string };
}) => {
  const { workflowId } = await params;
  return (
    <div className="h-full w-full overflow-auto">
      <TopBar
        workflowId={workflowId}
        hideButtons
        title="All runs"
        subTitle="List of all your workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full w-full">
            <Loader2Icon size={20} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
};

export default WorkflowHistoryPage;

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetworkflowExecutions(workflowId);
  if (!executions) return <div>-</div>;

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return <ExecutionTable workflowId={workflowId} />;
}
