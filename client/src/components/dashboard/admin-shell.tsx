"use client";

import { Suspense } from "react";
import { ThemeProvider } from "next-themes";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { AdminTopbar } from "@/components/dashboard/admin-topbar";
import { DashboardQueryProvider } from "@/components/dashboard/query-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <DashboardQueryProvider>
        <SidebarProvider>
          <Suspense fallback={null}>
            <AdminSidebar />
          </Suspense>
          <SidebarInset>
            <AdminTopbar />
            {children}
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </DashboardQueryProvider>
    </ThemeProvider>
  );
}
