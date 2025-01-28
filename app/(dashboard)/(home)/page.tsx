import { GetPeriods } from "@/actions/periods/getPeriods";
import React, { Suspense } from "react";
import { PeriodSelector } from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStatsCardsValues } from "@/actions/periods/getStatsCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { StatsCard } from "./_components/StatsCard";
import { GetWorkflowExecutionStats } from "@/actions/periods/getWorkflowExecutionStats";
import { ExecutionStatusChart } from "./_components/ExecutionStatusChart";
import { GetCreditsUsageInPeriod } from "@/actions/periods/getCreditsUsageInPeriod";
import { CreditsUsageChart } from "../billing/_components/CreditsUsageChart";

const HomePage = async ({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) => {
  const currentDate = new Date();
  const { month, year } = await searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectionWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <div className="w-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCardWrapper selectedPeriod={period} />
        </Suspense>

        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
};

async function PeriodSelectionWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await GetPeriods();
  return (
    <PeriodSelector periods={periods || []} selectedPeriod={selectedPeriod} />
  );
}

async function StatsCardWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetStatsCardsValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow execution"
        value={data?.workflowExecution || 0}
        Icon={CirclePlayIcon}
      />
      <StatsCard
        title="Phase execution"
        value={data?.phasesExecution || 0}
        Icon={WaypointsIcon}
      />
      <StatsCard
        title="Credits consumed"
        value={data?.creditsConsumed || 0}
        Icon={CoinsIcon}
      />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <Skeleton className="h-[120px]" />
      <Skeleton className="h-[120px]" />
      <Skeleton className="h-[120px]" />
    </div>
  );
}

async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}

async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);
  return (
    <CreditsUsageChart
      data={data}
      title="Daily credits spend"
      description="Daily credit consumed in selected period"
    />
  );
}

export default HomePage;
