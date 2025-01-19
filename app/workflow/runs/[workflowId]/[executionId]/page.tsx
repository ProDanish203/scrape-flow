import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { TopBar } from "@/app/workflow/_components/topbar/TopBar";
import { Loader2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { ExecutionViewer } from "./_components/ExecutionViewer";

const ExecutionPage = async ({
  params,
}: {
  params: { executionId: string; workflowId: string };
}) => {
  const { executionId, workflowId } = await params;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workflowId={workflowId}
        title="Workflow execution details"
        subTitle={`Execution ID: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center">
              <Loader2Icon className="animate-spin h-10 w-10 stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
};

export default ExecutionPage;

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) return notFound();
  return <ExecutionViewer initialData={workflowExecution} />;
}
