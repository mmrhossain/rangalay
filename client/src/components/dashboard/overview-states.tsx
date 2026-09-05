import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export function OverviewError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
    >
      <h2 className="text-lg font-semibold">Could not load overview</h2>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <form className="mt-4">
        <Button type="submit" variant="outline" size="sm">
          Retry
        </Button>
      </form>
    </div>
  );
}
