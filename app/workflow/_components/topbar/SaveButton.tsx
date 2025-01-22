"use client";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const SaveButton = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => toast.success("Workflow saved", { id: "save-workflow" }),
    onError: () =>
      toast.error("Failed to save workflow", { id: "save-workflow" }),
  });

  const handleSave = async () => {
    const workflowDefinition = JSON.stringify(toObject());
    toast.loading("Saving workflow...", { id: "save-workflow" });
    await mutate({ workflowId, definition: workflowDefinition });
  };

  return (
    <Button
      disabled={isPending}
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleSave}
    >
      <CheckIcon size={16} />
      <span className="max-md:hidden">Save</span>
    </Button>
  );
};
