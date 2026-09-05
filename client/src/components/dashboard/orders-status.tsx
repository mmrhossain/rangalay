import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  OrderStatus,
  OrdersByStatusResult,
} from "@/lib/dashboard-api/analytics";

const LABELS: Array<{ status: OrderStatus; className: string }> = [
  { status: "PENDING", className: "border-border text-foreground" },
  { status: "CONFIRMED", className: "bg-secondary text-secondary-foreground" },
  { status: "PROCESSING", className: "bg-secondary text-secondary-foreground" },
  { status: "SHIPPED", className: "bg-primary text-primary-foreground" },
  { status: "DELIVERED", className: "bg-primary text-primary-foreground" },
  { status: "CANCELLED", className: "bg-destructive text-white" },
];

export function OrdersStatusBreakdown({ data }: { data: OrdersByStatusResult }) {
  const total = Object.values(data.breakdown).reduce((sum, n) => sum + n, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
          <CardDescription>Current period breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No orders in this period yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by status</CardTitle>
        <CardDescription>{total} orders in this period</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {LABELS.map(({ status, className }) => (
          <span
            key={status}
            className={`inline-flex w-fit items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium ${className}`}
          >
            {status}: {data.breakdown[status]}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
