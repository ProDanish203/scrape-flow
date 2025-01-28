"use client";
import { DownloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const InvoiceBtn = ({ id }: { id: string }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => {
      window.open(data as string, "_blank");
    },
    onError: () => {
      toast.error("Failed to download invoice", {
        id: "invoice-download-fail",
      });
    },
  });

  const handleInvoiceDownload = async () => {
    mutate(id);
  };
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="text-xs gap-2 text-muted-foreground px-1"
      onClick={handleInvoiceDownload}
      disabled={isPending}
    >
      Invoice
      {isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
    </Button>
  );
};
