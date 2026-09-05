"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  customerLabel,
  fetchOrderById,
  money,
  ORDER_STATUSES,
  toOrderErrorMessage,
  updateOrderStatus,
  type OrderListItem,
  type OrderStatus,
} from "@/lib/dashboard-api/orders";

export type OrderDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderListItem | null;
};

function formatAddress(
  address:
    | {
        fullName: string;
        phone: string;
        city: string;
        country: string;
        addressLine1: string;
        addressLine2?: string | null;
        area?: string | null;
        postalCode?: string | null;
        state?: string | null;
      }
    | null
    | undefined
): string | null {
  if (!address) return null;
  return [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    address.area,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter((part) => part && String(part).trim())
    .join(", ");
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [remarks, setRemarks] = useState("");

  const detailQuery = useQuery({
    queryKey: ["admin-order", order?.id],
    queryFn: () => fetchOrderById(order!.id),
    enabled: open && Boolean(order?.id),
    staleTime: 30_000,
  });

  const detail = detailQuery.data ?? (order ? { ...order } : null);

  useEffect(() => {
    if (!open) return;
    setStatus("");
    setRemarks("");
  }, [open, order?.id]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!order) throw new Error("Missing order");
      if (!status) throw new Error("Select a status");
      return updateOrderStatus(order.id, {
        status,
        remarks: remarks.trim() || undefined,
      });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", order?.id] });
      toast.success(`Status updated to ${updated.status}`);
      setStatus("");
      setRemarks("");
    },
    onError: (err) => {
      toast.error(toOrderErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {detail ? `Order ${detail.orderNumber}` : "Order"}
          </DialogTitle>
          <DialogDescription>
            {detail
              ? `${customerLabel(detail)} · ${detail.status}`
              : "Order details"}
          </DialogDescription>
        </DialogHeader>

        {detailQuery.isError ? (
          <div role="alert" className="rounded-xl border border-destructive/30 p-4">
            <p className="text-sm">{toOrderErrorMessage(detailQuery.error)}</p>
          </div>
        ) : null}

        {!detail && detailQuery.isFetching ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : null}

        {detail ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="text-sm font-medium">{customerLabel(detail)}</p>
                {detail.customerProfile?.user?.email ? (
                  <p className="text-xs text-muted-foreground">
                    {detail.customerProfile.user.email}
                  </p>
                ) : null}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium">{detail.status}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Line items</p>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">SKU</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2">
                          {item.productName}
                          {item.variantName ? (
                            <span className="block text-xs text-muted-foreground">
                              {item.variantName}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {item.sku}
                        </td>
                        <td className="px-3 py-2 tabular-nums">{item.quantity}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {money(item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {formatAddress(detailQuery.data?.shippingAddress) ||
            formatAddress(detailQuery.data?.billingAddress) ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {formatAddress(detailQuery.data?.shippingAddress) ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping</p>
                    <p className="text-sm">
                      {formatAddress(detailQuery.data?.shippingAddress)}
                    </p>
                  </div>
                ) : null}
                {formatAddress(detailQuery.data?.billingAddress) ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Billing</p>
                    <p className="text-sm">
                      {formatAddress(detailQuery.data?.billingAddress)}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Subtotal</p>
                <p className="tabular-nums">{money(detail.subtotal)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Discount</p>
                <p className="tabular-nums">{money(detail.discountAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shipping</p>
                <p className="tabular-nums">{money(detail.shippingAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-medium tabular-nums">
                  {money(detail.grandTotal)}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-medium">Update status</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="order-status">Status</Label>
                  <Select
                    value={status || undefined}
                    onValueChange={(v) => setStatus(v as OrderStatus)}
                  >
                    <SelectTrigger id="order-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} disabled={s === detail.status}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="order-remarks">Remarks (optional)</Label>
                  <Textarea
                    id="order-remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    maxLength={500}
                    rows={2}
                    placeholder="Internal note"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            disabled={!status || mutation.isPending || !order}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Updating…" : "Update status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
