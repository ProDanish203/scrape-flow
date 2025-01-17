import { ThemeToggle } from "@/components/helpers";
import { Logo } from "@/components/shared";
import { Separator } from "@/components/ui/separator";
import React from "react";

const WorkflowLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex justify-between items-center p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ThemeToggle />
      </footer>
    </div>
  );
};

export default WorkflowLayout;
