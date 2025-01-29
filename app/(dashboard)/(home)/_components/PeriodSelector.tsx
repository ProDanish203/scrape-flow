"use client";

import { Period } from "@/types/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface PeriodSelectorProps {
  periods: Period[];
  selectedPeriod: Period;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periods,
  selectedPeriod,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map(({ month, year }) => (
          <SelectItem key={`${month}-${year}`} value={`${month}-${year}`}>
            {MONTH_NAMES[month]} {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
