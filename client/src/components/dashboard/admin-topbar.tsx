"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { dashboardAuthClient } from "@/lib/dashboard-api/auth-client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type AdminUser = {
  name?: string | null;
  email?: string | null;
};

export function AdminTopbar() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dashboardAuthClient
      .getSession()
      .then(({ data }) => {
        if (!cancelled) setUser(data?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await dashboardAuthClient.signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="size-9" aria-label="Toggle sidebar" />
      <Separator orientation="vertical" className="h-6" />
      <div className="ml-auto flex min-w-0 items-center gap-3">
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-medium leading-none">
            {user?.name || "Admin"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email || "Signed in"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={signingOut}
          className="cursor-pointer"
        >
          <LogOut />
          {signingOut ? "Signing out" : "Logout"}
        </Button>
      </div>
    </header>
  );
}
