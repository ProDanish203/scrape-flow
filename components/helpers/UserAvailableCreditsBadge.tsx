"use client";

import { GetAvalailableCredits } from "@/actions/billing/getAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { ReactCountupWrapper } from "./ReactCountupWrapper";
import { buttonVariants } from "../ui/button";

export const UserAvailableCreditsBadge = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: GetAvalailableCredits,
    refetchInterval: 30 * 1000, // 30 seconds
  });
  return (
    <Link
      href="/billing"
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({
          variant: "outline",
        })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span>
        {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
        {!isLoading && data && <ReactCountupWrapper value={data} />}
        {!isLoading && !data && "-"}
      </span>
    </Link>
  );
};
