"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

interface ExecuteButtonProps {
  workflowId: string;
}

export const ExecuteButton: React.FC<ExecuteButtonProps> = ({ workflowId }) => {
  const { generateExecutionPlan } = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow executed", { id: "workflow-execution" });
    },
    onError: (err) => {
      if (err.message === "NEXT_REDIRECT")
        return toast.dismiss("workflow-execution");

      toast.error("Failed to execute workflow", {
        id: "workflow-execution",
      });
    },
  });

  const handleExecution = () => {
    const plan = generateExecutionPlan();
    // Client side validation
    if (!plan) return;
    // console.log("-----PLAN STARTED------");
    // console.table(plan);
    // console.log("-----PLAN ENDED------");
    toast.loading("Executing workflow...", { id: "workflow-execution" });
    mutate({
      workflowId,
      flowDefintion: JSON.stringify(toObject()),
    });
  };

  return (
    <Button
      variant="default"
      className="flex items-center gap-2"
      onClick={handleExecution}
      disabled={isPending}
    >
      <PlayIcon size={16} className="stroke-white" />
      Execute
    </Button>
  );
};
