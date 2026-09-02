/**
 * Customer dashboard placeholder.
 *
 * Rendering strategy: SSR (no-cache) with CSR hydration - implementation in a
 * later task.
 */
export default function CustomerDashboardPage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Customer Dashboard
      </h1>
      <p className="text-muted-foreground">
        Customer area lands here (orders, wishlist, reviews, profile).
      </p>
    </section>
  );
}
