"use client";
import { dashboardRoutes } from "@/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Logo } from "./Logo";
import { UserAvailableCreditsBadge } from "../helpers";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute =
    dashboardRoutes.find(
      (route) => route.href.length > 0 && pathname === route.href
    ) || dashboardRoutes[0];
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="flex items-center justify-start">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <MenuIcon />
            </div>
          </SheetTrigger>
          <SheetContent
            className="w-[370px] sm:w-[540px] space-y-4"
            side={"left"}
          >
            <Logo />
            <UserAvailableCreditsBadge />

            <div className="flex flex-col gap-1">
              {dashboardRoutes.map((route, idx) => (
                <Link
                  href={route.href}
                  key={`${route.href}-${idx}`}
                  className={buttonVariants({
                    variant:
                      activeRoute === route
                        ? "sidebarActiveItem"
                        : "sidebarItem",
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
