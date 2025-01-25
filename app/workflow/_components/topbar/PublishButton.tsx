"use client";

import { useExecutionPlan } from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { waitFor } from "@/lib/helper/waitFor";

interface PublishButtonProps {
  workflowId: string;
}

export const PublishButton: React.FC<PublishButtonProps> = ({ workflowId }) => {
  const { generateExecutionPlan } = useExecutionPlan();
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: "workflow-published" });
    },
    onError: () => {
      toast.error("Failed to publish workflow", {
        id: "workflow-published",
      });
    },
  });

  const handleExecution = async () => {
    const plan = generateExecutionPlan();
    // Client side validation
    if (!plan) return;
    toast.loading("Publishing workflow...", { id: "workflow-published" });
    mutate({
      workflowId,
      flowDefintion: JSON.stringify(toObject()),
    });

    await waitFor(2000);
    return toast.dismiss("workflow-published");
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleExecution}
      disabled={isPending}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      <span className="max-md:hidden">Publish</span>
    </Button>
  );
};
