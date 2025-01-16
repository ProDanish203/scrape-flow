"use client";
import React, { ChangeEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName: string;
  workflowId: string;
}

const DeleteWorkflowDialog: React.FC<Props> = ({
  open,
  setOpen,
  workflowName,
  workflowId,
}) => {
  const [confirmText, setConfirmText] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteWorkflow,
    onSuccess: () => {
      toast.success("Workflow deleted successfully", {
        id: "delete-workflow",
      });
      setConfirmText("");
      setOpen(false);
    },
    onError: () =>
      toast.error("Failed to delete workflow", {
        id: "delete-workflow",
      }),
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmText === workflowName) {
      e.stopPropagation();
      toast.loading("Deleting workflow...", { id: "delete-workflow" });
      mutate(workflowId);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <div>
                If you are sure, enter <b>{workflowName}</b> to confirm
              </div>
              <Input
                value={confirmText}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmText(e.target.value)
                }
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel
            className={cn(
              "text-sm",
              buttonVariants({ size: "sm", variant: "outline" })
            )}
            onClick={() => setConfirmText("")}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== workflowName || isPending}
            className={cn(
              "text-destructive-foreground bg-destructive hover:bg-destructive/90",
              buttonVariants({ size: "sm", variant: "destructive" })
            )}
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
