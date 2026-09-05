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
  deleteProduct,
  toErrorMessage,
  type ProductListItem,
} from "@/lib/dashboard-api/products";

export type ProductDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductListItem | null;
};

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
}: ProductDeleteDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error("Missing product");
      await deleteProduct(product.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete product</DialogTitle>
          <DialogDescription>
            {product
              ? `Delete "${product.name}"? This cannot be undone.`
              : "Delete this product?"}
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
            disabled={!product || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
