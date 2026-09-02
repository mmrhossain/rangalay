/**
 * Vendor dashboard placeholder.
 *
 * Rendering strategy: SSR (no-cache) with CSR hydration - implementation in a
 * later task.
 */
export default function VendorDashboardPage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Vendor Dashboard</h1>
      <p className="text-muted-foreground">
        Vendor area lands here (products, inventory, orders for this vendor).
        Pending approval users land on /vendor/pending instead.
      </p>
    </section>
  );
}
