"use client";
import TooltipWrapper from "@/components/helpers/TooltipWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SaveButton } from "./SaveButton";
import { ExecuteButton } from "./ExecuteButton";
import { NavigationTabs } from "./NavigationTabs";
import { PublishButton } from "./PublishButton";
import { UnpublishButton } from "./UnpublishButton";

interface TopbarProps {
  title: string;
  workflowId: string;
  subTitle?: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

export const TopBar: React.FC<TopbarProps> = ({
  title,
  subTitle,
  workflowId,
  hideButtons,
  isPublished = false,
}) => {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="Back">
          <div
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
            onClick={() => router.back()}
          >
            <ChevronLeftIcon size={20} />
          </div>
        </TooltipWrapper>
        <div className="max-sm:hidden">
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            {isPublished ? (
              <UnpublishButton workflowId={workflowId} />
            ) : (
              <>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};
