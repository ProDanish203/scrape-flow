"use client";
import { dashboardRoutes } from "@/lib/data";
import React, { useState } from "react";
import { Logo } from "./Logo";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { UserAvailableCreditsBadge } from "../helpers";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const DesktopSidebar = () => {
  const pathname = usePathname();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeRoute =
    dashboardRoutes.find(
      (route) => route.href.length > 0 && pathname === route.href
    ) || dashboardRoutes[0];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        animate={{
          width: isSidebarCollapsed ? "70px" : "280px",
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        }}
        className={cn(
          "hidden relative md:block min-w-[280px] max-w-[280px] h-screen w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate transition-all duration-600",
          isSidebarCollapsed && "max-w-[70px] min-w-[70px]"
        )}
      >
        <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4 relative">
          <Logo hideText={isSidebarCollapsed} />
          <div
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="size-8 absolute -right-4 top-3.5 flex items-center justify-center bg-secondary shadow-md hover:shadow-lg transition  rounded-full z-10 cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <ChevronRightIcon size={12} className="stroke-primary" />
            ) : (
              <ChevronLeftIcon size={12} className="stroke-primary" />
            )}
          </div>
        </div>
        {!isSidebarCollapsed && (
          <div className="p-2">
            <UserAvailableCreditsBadge />
          </div>
        )}
        <div className="flex flex-col gap-y-2 p-2">
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
              {!isSidebarCollapsed && route.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
