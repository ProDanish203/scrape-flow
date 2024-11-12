import { ThemeToggle } from "@/components/helpers";
import { BreadcrumbHeader, DesktopSidebar } from "@/components/shared";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="container flex-1 py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
