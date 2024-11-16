import { Logo } from "@/components/shared";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Logo />
      {children}
    </div>
  );
};

export default AuthLayout;
