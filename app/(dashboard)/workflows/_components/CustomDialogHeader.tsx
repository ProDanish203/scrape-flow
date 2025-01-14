import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  Icon?: LucideIcon;
  title?: string;
  subTitle?: string;

  iconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

const CustomDialogHeader: React.FC<Props> = ({
  Icon,
  title,
  subTitle,
  iconClassName,
  titleClassName,
  subTitleClassName,
}) => {
  return (
    <DialogHeader>
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassName)} />
          )}
          {title && (
            <p className={cn("text-lg text-primary", titleClassName)}>
              {title}
            </p>
          )}
          {subTitle && (
            <p
              className={cn("text-sm text-muted-foreground", subTitleClassName)}
            >
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
