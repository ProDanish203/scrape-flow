import { ReactCountupWrapper } from "@/components/helpers/ReactCountupWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, Icon, title }) => {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountupWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
};
