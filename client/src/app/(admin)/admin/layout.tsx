import { AdminShell } from "@/components/dashboard/admin-shell";

export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      <main className="min-h-screen bg-background p-6">{children}</main>
    </AdminShell>
  );
}
