"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, TriangleAlertIcon } from "lucide-react";
import CustomDialogHeader from "./CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import { waitFor } from "@/lib/helper/waitFor";
import { ChangeEvent, useState } from "react";

export const SchedulerDialog = ({ workflowId }: { workflowId: string }) => {
  const [cron, setCron] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Workflow scheduled successfully", {
        id: "workflow-scheduled",
      });
    },
    onError: (err) => {
      if (err.message.includes("Validation error")) {
        toast.error("Invalid cron expression", {
          id: "workflow-scheduled",
        });
        toast.dismiss("workflow-scheduled-loading");
      } else {
        toast.error("Failed to schedule workflow", {
          id: "workflow-scheduled",
        });
      }
    },
  });

  const handleScheduleWorkflow = async () => {
    if (!cron)
      return toast.error("Please provide a cron expression", {
        id: "workflow-scheduled",
      });

    toast.loading("Saving schedule...", { id: "workflow-scheduled-loading" });
    mutate({ workflowId: workflowId, cron });

    await waitFor(1000);
    toast.dismiss("workflow-scheduled-loading");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn("text-sm p-0 h-auto")}
        >
          <div className="flex items-center gap-1">
            <TriangleAlertIcon className="h-3 w-3 mr-1" /> Set Schedule
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          Icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule periodic workflow execution.
            All time are in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCron(e.target.value)
            }
          />
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={isPending}
              onClick={handleScheduleWorkflow}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
