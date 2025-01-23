"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { waitFor } from "@/lib/helper/waitFor";
import { UnpublishWorkflow } from "@/actions/workflows/unpublishworkflow";

interface UnpublishButtonProps {
  workflowId: string;
}

export const UnpublishButton: React.FC<UnpublishButtonProps> = ({
  workflowId,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: "workflow-unpublished" });
    },
    onError: () => {
      toast.error("Failed to unpublish workflow", {
        id: "workflow-unpublished",
      });
    },
  });

  const handleUnpublish = async () => {
    toast.loading("Publishing workflow...", { id: "workflow-unpublished" });
    mutate(workflowId);

    await waitFor(2000);
    return toast.dismiss("workflow-published");
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleUnpublish}
      disabled={isPending}
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      <span className="max-md:hidden">Unpublish</span>
    </Button>
  );
};
