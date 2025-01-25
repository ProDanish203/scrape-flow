"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetworkflowExecutions } from "@/actions/workflows/getworkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import { DatesToDurationString } from "@/lib/helper/dates";
import { Badge } from "@/components/ui/badge";
import { ExecutionStatusIndicator } from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof GetworkflowExecutions>>;

export const ExecutionTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["workflowExecutions", workflowId],
    queryFn: () => GetworkflowExecutions(workflowId),
    initialData,
    refetchInterval: 5000,
  });

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started at {`(desc)`}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-none">
          {data?.map((execution) => {
            const duration = DatesToDurationString(
              execution.completedAt,
              execution.startedAt
            );
            const formattedstartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, { addSuffix: true });
            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/workflow/runs/${execution.workflowId}/${execution.id}`
                  )
                }
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs flex items-center gap-1">
                      <span>Triggered via</span>
                      <Badge variant="outline">{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExecutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedstartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
