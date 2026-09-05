"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  COUPON_STATUSES,
  createCoupon,
  DISCOUNT_TYPES,
  toCouponErrorMessage,
  updateCoupon,
  type CouponListItem,
  type CouponStatus,
  type DiscountType,
} from "@/lib/dashboard-api/coupons";

const optionalAmount = z.preprocess(
  (v) => (v === "" || v === undefined || v === null || Number.isNaN(v) ? undefined : v),
  z.number().nonnegative().optional()
);

const optionalPositiveInt = z.preprocess(
  (v) => (v === "" || v === undefined || v === null || Number.isNaN(v) ? undefined : v),
  z.number().int().positive().optional()
);

const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(100)
    .regex(/^[A-Za-z0-9_-]+$/, "Letters, numbers, _ and - only"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(COUPON_STATUSES),
  discountType: z.enum(DISCOUNT_TYPES),
  discountValue: z.number().nonnegative("Must be 0 or greater"),
  minimumOrderAmount: optionalAmount,
  maximumDiscountAmount: optionalAmount,
  usageLimit: optionalPositiveInt,
  usageLimitPerCustomer: optionalPositiveInt,
  startsAt: z.string().min(1, "Start date is required"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  isActive: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export type CouponFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: CouponListItem;
};

function toDatetimeLocal(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(value: string): string {
  return new Date(value).toISOString();
}

function defaultValues(initialData?: CouponListItem): CouponFormValues {
  return {
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? "ACTIVE",
    discountType: initialData?.discountType ?? "PERCENTAGE",
    discountValue: Number(initialData?.discountValue ?? 0),
    minimumOrderAmount:
      initialData?.minimumOrderAmount == null
        ? undefined
        : Number(initialData.minimumOrderAmount),
    maximumDiscountAmount:
      initialData?.maximumDiscountAmount == null
        ? undefined
        : Number(initialData.maximumDiscountAmount),
    usageLimit: initialData?.usageLimit ?? undefined,
    usageLimitPerCustomer: initialData?.usageLimitPerCustomer ?? undefined,
    startsAt: toDatetimeLocal(initialData?.startsAt),
    expiresAt: toDatetimeLocal(initialData?.expiresAt),
    isActive: initialData?.isActive ?? true,
  };
}

export function CouponFormDialog({
  open,
  onOpenChange,
  mode,
  initialData,
}: CouponFormDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: defaultValues(initialData),
  });

  useEffect(() => {
    if (!open) return;
    form.reset(defaultValues(initialData));
  }, [open, mode, initialData, form]);

  const mutation = useMutation({
    mutationFn: async (values: CouponFormValues) => {
      const body = {
        code: values.code,
        name: values.name,
        description: values.description?.trim() || undefined,
        status: values.status as CouponStatus,
        discountType: values.discountType as DiscountType,
        discountValue: values.discountValue,
        minimumOrderAmount: values.minimumOrderAmount,
        maximumDiscountAmount: values.maximumDiscountAmount,
        usageLimit: values.usageLimit ?? null,
        usageLimitPerCustomer: values.usageLimitPerCustomer ?? null,
        startsAt: toIso(values.startsAt),
        expiresAt: toIso(values.expiresAt),
        isActive: values.isActive,
        applicableProductIds: [] as string[],
        applicableCategoryIds: [] as string[],
      };
      if (mode === "create") {
        await createCoupon(body);
        return;
      }
      if (!initialData?.id) throw new Error("Missing coupon id");
      await updateCoupon(initialData.id, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success(mode === "create" ? "Coupon created" : "Coupon updated");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toCouponErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Coupon" : "Edit Coupon"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a discount coupon."
              : "Update coupon details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SAVE10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISCOUNT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
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
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="minimumOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={
                          field.value === undefined || Number.isNaN(field.value)
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
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
                name="maximumDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={
                          field.value === undefined || Number.isNaN(field.value)
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          field.value === undefined || Number.isNaN(field.value)
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
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
                name="usageLimitPerCustomer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per customer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          field.value === undefined || Number.isNaN(field.value)
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starts at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUPON_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
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
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? "Saving..."
                  : mode === "create"
                    ? "Create coupon"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
