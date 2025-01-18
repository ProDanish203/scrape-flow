"use client";
import TooltipWrapper from "@/components/helpers/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SaveButton } from "./SaveButton";
import { ExecuteButton } from "./ExecuteButton";

interface TopbarProps {
  title: string;
  workflowId: string;
  subTitle?: string;
  hideButtons?: boolean;
}

export const TopBar: React.FC<TopbarProps> = ({
  title,
  subTitle,
  workflowId,
  hideButtons,
}) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            <SaveButton workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  );
};
