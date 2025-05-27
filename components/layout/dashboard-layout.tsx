"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[280px]">
        <Header />
        <ScrollArea className="flex-1">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  );
}