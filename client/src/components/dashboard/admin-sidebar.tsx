"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ShoppingCart,
  CreditCard,
  TicketPercent,
  Star,
  Store,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/users?role=VENDOR", label: "Vendors", icon: Store },
  { href: "/admin/users", label: "Users", icon: Users },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const vendorFilter = searchParams.get("role") === "VENDOR";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link href="/admin" className="flex items-center gap-2 px-1">
          <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            R
          </span>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Rangalay Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : item.href === "/admin/users?role=VENDOR"
                      ? pathname === "/admin/users" && vendorFilter
                      : item.href === "/admin/users"
                        ? pathname === "/admin/users" && !vendorFilter
                        : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
