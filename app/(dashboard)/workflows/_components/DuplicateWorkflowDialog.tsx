"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import CustomDialogHeader from "./CustomDialogHeader";
import { useForm } from "react-hook-form";
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";

export const DuplicateWorkflowDialog = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: () => {
      toast.success("Workflow duplicated successfully", {
        id: "duplicate-workflow",
      });
      form.reset();
      setOpen(false);
      toast.dismiss("duplicate-workflow");
    },
    onError: (err) => {
      if (err.message === "NEXT_REDIRECT")
        return toast.dismiss("duplicate-workflow");

      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <div
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100",
            buttonVariants({
              variant: "outline",
              size: "icon",
            })
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </div>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader Icon={Layers2Icon} title="Duplicate workflow" />
        <div className="p-6">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p
                        className={cn(
                          "text-xs text-primary",
                          form.formState.errors.name && "text-red-400"
                        )}
                      >{`(required)`}</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique and descriptive name of the workflow
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">{`(optional)`}</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a unique and descriptive name of the workflow
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
