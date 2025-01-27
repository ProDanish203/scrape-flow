"use client";

import { GetWorkflowExecutionStats } from "@/actions/periods/getWorkflowExecutionStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Layers2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>;

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-1))",
  },
};

export const ExecutionStatusChart = ({ data }: { data: ChartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Layers2Icon className="w-6 h-6 text-primary" />
          Workflow exution status
        </CardTitle>
        <CardDescription>
          Daily number of successful and failed workflow execution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <AreaChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey={"success"}
              min={0}
              type={"bump"}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              fillOpacity={0.6}
              stackId={"a"}
            />
            <Area
              dataKey={"failed"}
              min={0}
              type={"bump"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.6}
              stackId={"a"}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
