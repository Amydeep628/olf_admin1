"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Users,
  Calendar,
  Newspaper,
  Building2,
  GraduationCap,
  Network,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Users,
      label: "Alumni",
      href: "/dashboard/alumni",
    },
    {
      icon: Calendar,
      label: "Events",
      href: "/dashboard/events",
    },
    {
      icon: Newspaper,
      label: "News & Updates",
      href: "/dashboard/news",
    },
    {
      icon: Building2,
      label: "Business Directory",
      href: "/dashboard/business",
    },
    {
      icon: GraduationCap,
      label: "Educators",
      href: "/dashboard/educators",
    },
    {
      icon: Network,
      label: "Networking",
      href: "/dashboard/networking",
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-full transition-all duration-300 bg-background border-r hidden md:block",
          collapsed ? "w-[80px]" : "w-[280px]",
          className
        )}
      >
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            {!collapsed && (
              <span className="font-semibold text-lg">OLF Alumni Admin</span>
            )}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 ml-auto",
                collapsed && "rotate-180"
              )}
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid gap-1 px-2 py-2">
              {routes.map((route, i) => (
                <Link
                  key={i}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                    pathname === route.href && "bg-accent",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <route.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
                  {!collapsed && <span>{route.label}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={toggleMobileSidebar} />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[280px] bg-background transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <span className="font-semibold text-lg">OLF Alumni Admin</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 ml-auto"
                onClick={toggleMobileSidebar}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close Sidebar</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <nav className="grid gap-1 px-2 py-2">
                {routes.map((route, i) => (
                  <Link
                    key={i}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                      pathname === route.href && "bg-accent"
                    )}
                    onClick={toggleMobileSidebar}
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.label}</span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}