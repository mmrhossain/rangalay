"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  deleteCoupon,
  toCouponErrorMessage,
  type CouponListItem,
} from "@/lib/dashboard-api/coupons";

export type CouponDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: CouponListItem | null;
};

export function CouponDeleteDialog({
  open,
  onOpenChange,
  coupon,
}: CouponDeleteDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!coupon) throw new Error("Missing coupon");
      await deleteCoupon(coupon.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toCouponErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete coupon</DialogTitle>
          <DialogDescription>
            {coupon
              ? `Delete "${coupon.code}"? This cannot be undone.`
              : "Delete this coupon?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!coupon || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
