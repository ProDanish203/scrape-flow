"use client";
import { dashboardRoutes } from "@/lib/data";
import React from "react";
import { Logo } from "./Logo";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { UserAvailableCreditsBadge } from "../helpers";

export const DesktopSidebar = () => {
  const pathname = usePathname();
  const activeRoute =
    dashboardRoutes.find(
      (route) => route.href.length > 0 && pathname === route.href
    ) || dashboardRoutes[0];
  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {dashboardRoutes.map((route, idx) => (
          <Link
            href={route.href}
            key={`${route.href}-${idx}`}
            className={buttonVariants({
              variant:
                activeRoute === route ? "sidebarActiveItem" : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
