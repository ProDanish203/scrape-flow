"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, PlusIcon, ShieldEllipsis } from "lucide-react";
import React, { useCallback, useState } from "react";
import CustomDialogHeader from "../../workflows/_components/CustomDialogHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { CreateCredential } from "@/actions/credentials/createCredential";
import { Textarea } from "@/components/ui/textarea";

export const CreateCredentialDialog = ({
  triggerText,
}: {
  triggerText?: string;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created successfully", {
        id: "create-credential",
      });
      form.reset();
      setOpen(false);
      toast.dismiss("create-credential");
    },
    onError: (err) => {
      if (err.message === "NEXT_REDIRECT")
        return toast.dismiss("create-credential");

      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
      toast.loading("Creating credential...", { id: "create-credential" });
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
            "cursor-pointer",
            buttonVariants({
              variant: "default",
            })
          )}
        >
          <PlusIcon size={20} className="sm:hidden font-bold" />
          <span className="max-sm:hidden">
            {triggerText ?? "Create Credential"}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader Icon={ShieldEllipsis} title="Create Credential" />
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
                      Enter a unique and descriptive name for the credential.
                      <br />
                      This name will be used to identify the credential.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p
                        className={cn(
                          "text-xs text-primary",
                          form.formState.errors.value && "text-red-400"
                        )}
                      >{`(required)`}</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential.
                      <br />
                      This value will be securely encrypted and stored.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Create"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
