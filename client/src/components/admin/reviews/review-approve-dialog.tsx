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
  approveReview,
  reviewCustomerLabel,
  toReviewErrorMessage,
  type AdminReviewItem,
} from "@/lib/dashboard-api/reviews";

export type ReviewApproveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: AdminReviewItem | null;
};

export function ReviewApproveDialog({
  open,
  onOpenChange,
  review,
}: ReviewApproveDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!review) throw new Error("Missing review");
      await approveReview(review.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review approved");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toReviewErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve review</DialogTitle>
          <DialogDescription>
            {review
              ? `Approve the ${review.rating}-star review by ${reviewCustomerLabel(review)} on ${review.product?.name ?? "this product"}?`
              : "Approve this review?"}
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
            disabled={!review || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Approving..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
