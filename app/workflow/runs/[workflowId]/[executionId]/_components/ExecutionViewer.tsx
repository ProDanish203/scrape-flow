"use client";
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import React, { ReactNode, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getworkflowPhaseDetails";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import { cn } from "@/lib/utils";
import { LogLevel } from "@/types/log";
import { PhaseStatusBadge } from "./PhaseStatusBadge";

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

  useEffect(() => {
    const phases = data?.phases || [];
    if (isRunning) {
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1
      )[0];

      setSelectedPhase(phaseToSelect?.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1
    )[0];
    setSelectedPhase(phaseToSelect?.id);
  }, [data?.phases, isRunning, setSelectedPhase]);

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
                  <PhaseStatusBadge
                    status={phase.status as ExecutionPhaseStatus}
                  />
                </Button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex w-full h-full">
            {isRunning && (
              <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <p className="font-bold">Run is in progress, please wait</p>
              </div>
            )}
            {!isRunning && !selectedPhase && (
              <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <div className="flex flex-col gap-1 text-center">
                  <p className="font-bold">No phase selected</p>
                  <p className="text-sm text-muted-foreground">
                    Select a phase to view details
                  </p>
                </div>
              </div>
            )}

            {!isRunning && selectedPhase && phaseData && (
              <div className="flex flex-col py-4 container gap-4 overflow-auto">
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="space-x-4">
                    <div className="flex gap-1 items-center">
                      <CoinsIcon
                        size={18}
                        className="stroke-muted-foreground"
                      />
                      <span>Credits</span>
                      <span>TODO</span>
                    </div>
                  </Badge>

                  <Badge variant="outline" className="space-x-4">
                    <div className="flex gap-1 items-center">
                      <ClockIcon
                        size={18}
                        className="stroke-muted-foreground"
                      />
                      <span>Duration</span>
                      <span>
                        {DatesToDurationString(
                          phaseData.completedAt,
                          phaseData.startedAt
                        ) || "-"}
                      </span>
                    </div>
                  </Badge>
                </div>

                <ParameterViewer
                  title="Inputs"
                  subtitle="Input used for this phase"
                  paramsJson={phaseData.inputs}
                />

                <ParameterViewer
                  title="Outputs"
                  subtitle="Output generated by this phase"
                  paramsJson={phaseData.outputs}
                />

                <LogViewer logs={phaseData.logs} />
              </div>
            )}
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

function ParameterViewer({
  title,
  subtitle,
  paramsJson,
}: {
  title: string;
  subtitle: string;
  paramsJson: string | null;
}) {
  const params: Record<string, any> = JSON.parse(paramsJson || "{}");
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No parameters generated by this phase</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input readOnly className="flex-1 basis-2/3" value={value} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || logs.length === 0) return null;
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell
                  width={190}
                  className="text-xs text-muted-foreground p-[2px] pl-4"
                >
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-4",
                    (log.logLevel as LogLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as LogLevel) === "info" && "text-primary",
                    (log.logLevel as LogLevel) === "warn" && "text-yellow-400"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
