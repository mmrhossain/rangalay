import { InventoryTable } from "@/components/dashboard/inventory-table";
import {
  fetchInventoryList,
  toInventoryErrorMessage,
} from "@/lib/dashboard-api/inventory";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  let initial;
  let error: string | null = null;

  try {
    initial = await fetchInventoryList({ page: 1, limit: 20 });
  } catch (err) {
    error = toInventoryErrorMessage(err);
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Stock levels from the live backend. Low stock is under 10 available.
        </p>
      </div>
      {error || !initial ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <h2 className="text-lg font-semibold">Could not load inventory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {error ?? "Unknown error"}
          </p>
        </div>
      ) : (
        <InventoryTable initialData={initial} />
      )}
    </section>
  );
}
