import { cn } from "@/lib/utils";
import { WorkflowExecutionStatus } from "@/types/workflow";
import React from "react";

const indicatorColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "bg-slate-500",
  RUNNING: "bg-yellow-500",
  FAILED: "bg-red-500",
  COMPLETED: "bg-emerald-500",
};

export const ExecutionStatusIndicator = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return (
    <div className={cn("w-2 h-2 rounded-full", indicatorColors[status])} />
  );
};

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-500",
  RUNNING: "text-yellow-500",
  FAILED: "text-red-500",
  COMPLETED: "text-emerald-500",
};

export const ExecutionStatusLabel = ({
  status,
}: {
  status: WorkflowExecutionStatus;
}) => {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
};
