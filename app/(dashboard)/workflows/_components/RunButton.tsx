"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { waitFor } from "@/lib/helper/waitFor";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { toast } from "sonner";

interface RunButtonProps {
  workflowId: string;
}

export const RunButton: React.FC<RunButtonProps> = ({ workflowId }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: "workflow-started" });
    },
    onError: (err) => {
      if (err.message === "NEXT_REDIRECT")
        return toast.dismiss("workflow-started");

      toast.error("Failed to start workflow", {
        id: "workflow-started",
      });
    },
  });

  const handleRun = async () => {
    toast.loading("Starting workflow...", { id: "workflow-started" });
    mutate({
      workflowId,
    });
    await waitFor(2000);
    toast.dismiss("workflow-started");
  };
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleRun}
      disabled={isPending}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
};
