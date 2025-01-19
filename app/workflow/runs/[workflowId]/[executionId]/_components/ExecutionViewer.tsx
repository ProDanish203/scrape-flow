"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import React, { ReactNode, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getworkflowPhaseDetails";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

interface ExecutionViewerProps {
  initialData: ExecutionData;
}

export const ExecutionViewer: React.FC<ExecutionViewerProps> = ({
  initialData,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workflowExecution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const { data: phaseData } = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const isRunning = data?.status === WorkflowExecutionStatus.RUNNING;

  const duration = DatesToDurationString(data?.completedAt, data?.startedAt);

  const creditsConsumed = GetPhasesTotalCost(data?.phases || []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin h-10 w-10 stroke-primary" />
      </div>
    );
  }

  return (
    <>
      {data && (
        <div className="flex w-full h-full">
          {/* Sidebar */}
          <aside className="w-[440px] min-w-[440px] max-w-[400px] border-r-2 border-separate flex flex-col flex-grow overflow-hidden">
            <div className="py-4 px-2">
              <ExecutionLabel
                label="Status"
                value={data.status}
                Icon={CircleDashedIcon}
              />

              <ExecutionLabel
                label="Started At"
                value={
                  <span className="lowercase">
                    {data.startedAt
                      ? formatDistanceToNow(new Date(data.startedAt), {
                          addSuffix: true,
                        })
                      : "-"}
                  </span>
                }
                Icon={CalendarIcon}
              />

              <ExecutionLabel
                label="Duration"
                value={
                  duration ? (
                    duration
                  ) : (
                    <Loader2Icon
                      size={20}
                      className="animate-spin stroke-primary"
                    />
                  )
                }
                Icon={ClockIcon}
              />

              <ExecutionLabel
                label="Credits consumed"
                value={creditsConsumed}
                Icon={CoinsIcon}
              />
            </div>
            <Separator />
            <div className="flex justify-center items-center py-2 px-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <WorkflowIcon
                  size={20}
                  className="stroke-muted-foreground/80"
                />
                <span className="font-semibold">Phases</span>
              </div>
            </div>
            <Separator />
            <div className="overflow-auto h-full px-2 py-4">
              {data.phases.map((phase, index) => (
                <Button
                  key={phase.id}
                  variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => {
                    if (isRunning) return;
                    setSelectedPhase(phase.id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <p className="font-semibold">{phase.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {phase.status}
                  </p>
                </Button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex w-full h-full">
            <pre>{JSON.stringify(phaseData, null, 4)}</pre>
          </div>
        </div>
      )}
    </>
  );
};

function ExecutionLabel({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground/80" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}
