"use client";
import { Workflow } from "@prisma/client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/types/workflow";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/helpers/TooltipWrapper";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import { RunButton } from "./RunButton";
import { SchedulerDialog } from "./SchedulerDialog";
import { Badge } from "@/components/ui/badge";
import {
  ExecutionStatusIndicator,
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  workflow: Workflow;
}

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-white",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

export const WorkflowCard: React.FC<Props> = ({ workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-md rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center      justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center bg-red-500     justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon size={20} className="h-5 w-5" />
            ) : (
              <PlayIcon size={20} className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yello-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
            {!isDraft && (
              <SchedulerSection
                workflowId={workflow.id}
                creditsCost={workflow.creditsCost}
                cron={workflow.cron}
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              "flex items-center gap-2",
              buttonVariants({
                variant: "outline",
                size: "sm",
              })
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      {workflow.status !== WorkflowStatus.DRAFT && (
        <LastRunDetails workflow={workflow} />
      )}
    </Card>
  );
};

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TooltipWrapper content={"More actions"}>
            <Button variant={"outline"} size={"sm"}>
              <MoreVerticalIcon size={18} />
            </Button>
          </TooltipWrapper>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2 hover:!text-destructive/90"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function SchedulerSection({
  workflowId,
  creditsCost,
  cron,
}: {
  creditsCost: number;
  workflowId: string;
  cron?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog workflowId={workflowId} cron={cron} />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant={"outline"}
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="h-4 w-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const { lastRunAt, lastRunStatus, id, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextRunSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextRunScheduleUtc =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");
  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt ? (
          <Link
            href={`/workflow/runs/${id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run: </span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] group-hover:translate-x-0 transition"
            />
          </Link>
        ) : (
          <p>no runs yet</p>
        )}
      </div>

      {nextRunAt && (
        <div className="flex items-center text-sm gap-2">
          <ClockIcon size={12} />
          <span>Next run at: </span>
          <span>{nextRunSchedule}</span>
          <span className="text-xs">&#40;{nextRunScheduleUtc} UTC&#41;</span>
        </div>
      )}
    </div>
  );
}
