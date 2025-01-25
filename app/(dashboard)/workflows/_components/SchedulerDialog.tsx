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
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import CustomDialogHeader from "./CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCron";
import { toast } from "sonner";
import { waitFor } from "@/lib/helper/waitFor";
import { ChangeEvent, useEffect, useState } from "react";
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import { RemoveWorkflowCron } from "@/actions/workflows/removeWorkflowCron";
import { Separator } from "@/components/ui/separator";

export const SchedulerDialog = ({
  cron,
  workflowId,
}: {
  workflowId: string;
  cron?: string | null;
}) => {
  const [cronValue, setCronValue] = useState(cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Workflow schedule updated", {
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

  const { mutate: removeScheduleMutate, isPending: removeScheduleIsPending } =
    useMutation({
      mutationFn: RemoveWorkflowCron,
      onSuccess: () => {
        toast.success("Workflow schedule updated", {
          id: "workflow-scheduled",
        });
      },
      onError: () => {
        toast.error("Failed to schedule workflow", {
          id: "workflow-scheduled",
        });
      },
    });

  useEffect(() => {
    try {
      if (cronValue) {
        cronParser.parseExpression(cronValue, { utc: true });
        const humamCronStr = cronstrue.toString(cronValue);
        setValidCron(true);
        setReadableCron(humamCronStr);
      }
    } catch (err) {
      setValidCron(false);
    }
  }, [cronValue]);

  const workflowHasValidCron = cron && cron.length > 0;
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(cron);

  const handleScheduleWorkflow = async () => {
    if (!cronValue)
      return toast.error("Please provide a cron expression", {
        id: "workflow-scheduled",
      });

    toast.loading("Saving schedule...", { id: "workflow-scheduled-loading" });
    mutate({ workflowId: workflowId, cron: cronValue });

    await waitFor(1000);
    toast.dismiss("workflow-scheduled-loading");
  };

  const handleRemoveScheduleWorkflow = async () => {
    toast.loading("Saving schedule...", { id: "workflow-scheduled-loading" });
    removeScheduleMutate(workflowId);

    await waitFor(1000);
    toast.dismiss("workflow-scheduled-loading");
  };

  return (
    <Dialog onOpenChange={() => setCronValue(cron || "")}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron ? (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3 mr-1" /> Set Schedule
            </div>
          )}
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
            value={cronValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCronValue(e.target.value)
            }
          />

          <div
            className={cn(
              "bg-accent rounded-md p-4 text-sm border border-destructive text-destructive",
              validCron && "border-primary text-primary",
              !cronValue && "hidden"
            )}
          >
            {validCron
              ? readableCron
              : cronValue && "Not a valid Cron expression"}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={"outline"}
                  disabled={removeScheduleIsPending || isPending}
                  onClick={handleRemoveScheduleWorkflow}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
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
              disabled={isPending || !validCron}
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
