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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DeleteCredential } from "@/actions/credentials/deleteCredential";
import { XIcon } from "lucide-react";

interface Props {
  credentialName: string;
}

export const DeleteCredentialDialog: React.FC<Props> = ({ credentialName }) => {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", {
        id: "delete-credential",
      });
      setConfirmText("");
      setOpen(false);
    },
    onError: () =>
      toast.error("Failed to delete credential", {
        id: "delete-credential",
      }),
  });

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmText === credentialName) {
      e.stopPropagation();
      toast.loading("Deleting credential...", { id: "delete-credential" });
      mutate(credentialName);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div
          className={buttonVariants({
            variant: "destructive",
            size: "icon",
          })}
        >
          <XIcon size={18} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="">
            If you delete this credential, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <div>
                If you are sure, enter <b>{credentialName}</b> to confirm
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
            disabled={confirmText !== credentialName || isPending}
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
