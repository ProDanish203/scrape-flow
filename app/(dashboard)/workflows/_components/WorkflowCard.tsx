import { Workflow } from "@prisma/client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import {
  FileTextIcon,
  MoreVerticalIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/helpers/TooltipWrapper";

interface Props {
  workflow: Workflow;
}

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-white",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

export const WorkflowCard: React.FC<Props> = ({ workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-md rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center      justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center bg-red-500     justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon size={20} className="h-5 w-5" />
            ) : (
              <PlayIcon size={20} className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yello-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              "flex items-center gap-2",
              buttonVariants({
                variant: "outline",
                size: "sm",
              })
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions />
        </div>
      </CardContent>
    </Card>
  );
};

function WorkflowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipWrapper content={"More actions"}>
          <Button variant={"outline"} size={"sm"}>
            <MoreVerticalIcon size={18} />
          </Button>
        </TooltipWrapper>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive flex items-center gap-2 hover:!text-destructive/90">
          <TrashIcon size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
