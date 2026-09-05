"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  approveInventoryAdjustment,
  createInventoryAdjustment,
  toInventoryErrorMessage,
  type InventoryListItem,
} from "@/lib/dashboard-api/inventory";

const REASONS = ["RESTOCK", "DAMAGE", "CORRECTION", "RETURN"] as const;

const adjustFormSchema = z.object({
  type: z.enum(["increase", "decrease", "set"]),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  reason: z.enum(REASONS),
  notes: z.string().optional(),
});

type AdjustFormValues = z.infer<typeof adjustFormSchema>;

export type StockAdjustDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryListItem | null;
};

function differenceFor(
  type: AdjustFormValues["type"],
  quantity: number,
  onHand: number
): number {
  if (type === "increase") return quantity;
  if (type === "decrease") return -quantity;
  return quantity - onHand;
}

export function StockAdjustDialog({
  open,
  onOpenChange,
  item,
}: StockAdjustDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustFormSchema),
    defaultValues: {
      type: "increase",
      quantity: 1,
      reason: "RESTOCK",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      type: "increase",
      quantity: 1,
      reason: "RESTOCK",
      notes: "",
    });
  }, [open, item, form]);

  const mutation = useMutation({
    mutationFn: async (values: AdjustFormValues) => {
      if (!item) throw new Error("Missing inventory row");
      if (values.type !== "set" && values.quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }
      const difference = differenceFor(
        values.type,
        values.quantity,
        item.quantityOnHand
      );
      if (difference === 0) throw new Error("No quantity change");
      const reason = values.notes?.trim()
        ? `${values.reason}: ${values.notes.trim()}`
        : values.reason;
      const created = await createInventoryAdjustment({
        warehouseId: item.warehouseId,
        variantId: item.variantId,
        difference,
        reason,
      });
      await approveInventoryAdjustment(created.id);
      return item.quantityAvailable + difference;
    },
    onSuccess: (available) => {
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
      toast.success(`Stock updated. Available: ${available}`);
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toInventoryErrorMessage(err));
    },
  });

  const productName = item?.variant.product.name ?? "variant";
  const sku = item?.variant.sku ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {item
              ? `${productName} (${sku}) at ${item.warehouse.name}. On hand: ${item.quantityOnHand}, available: ${item.quantityAvailable}.`
              : "Adjust inventory quantity."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                      <SelectItem value="set">Set to</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      value={Number.isFinite(field.value) ? field.value : ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : e.target.valueAsNumber
                        )
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!item || mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Apply adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
