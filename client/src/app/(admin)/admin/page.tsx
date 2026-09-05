import { Suspense } from "react";

import { OverviewError, OverviewSkeleton } from "@/components/dashboard/overview-states";
import { OverviewMetricsGrid } from "@/components/dashboard/overview-metrics";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { OrdersStatusBreakdown } from "@/components/dashboard/orders-status";
import { TopProductsTable } from "@/components/dashboard/top-products";
import {
  fetchOrdersByStatus,
  fetchOverview,
  fetchSales,
  fetchTopProducts,
  toErrorMessage,
} from "@/lib/dashboard-api/analytics";

export const dynamic = "force-dynamic";

async function OverviewBody() {
  try {
    const [overview, sales, ordersByStatus, topProducts] = await Promise.all([
      fetchOverview(),
      fetchSales(),
      fetchOrdersByStatus(),
      fetchTopProducts(),
    ]);

    return (
      <div className="space-y-6">
        <OverviewMetricsGrid data={overview} />
        <SalesChart data={sales} />
        <div className="grid gap-4 lg:grid-cols-2">
          <OrdersStatusBreakdown data={ordersByStatus} />
          <TopProductsTable data={topProducts} />
        </div>
      </div>
    );
  } catch (err) {
    return <OverviewError message={toErrorMessage(err)} />;
  }
}

export default function DashboardOverviewPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Live store metrics from the last reporting period.
        </p>
      </div>
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewBody />
      </Suspense>
    </section>
  );
}
