"use client";
import { dashboardRoutes } from "@/lib/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Logo } from "./Logo";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute =
    dashboardRoutes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || dashboardRoutes[0];
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side={"left"}
          >
            <SheetTitle>
              <Logo />
            </SheetTitle>
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
