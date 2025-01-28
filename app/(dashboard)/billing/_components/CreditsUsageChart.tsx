"use client";

import { GetCreditsUsageInPeriod } from "@/actions/periods/getCreditsUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStackedIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>;

interface CreditsUsageChartProps {
  data: ChartData;
  title: string;
  description: string;
}

const chartConfig = {
  success: {
    label: "Successfull Phase Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phase Credits",
    color: "hsl(var(--chart-1))",
  },
};

export const CreditsUsageChart: React.FC<CreditsUsageChartProps> = ({
  data,
  title,
  description,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
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
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              dataKey={"success"}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              stackId={"a"}
            />
            <Bar
              dataKey={"failed"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
