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
  approveUser,
  toUserErrorMessage,
  type AdminUserItem,
} from "@/lib/dashboard-api/users";

export type UserApproveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserItem | null;
  approve: boolean;
};

export function UserApproveDialog({
  open,
  onOpenChange,
  user,
  approve,
}: UserApproveDialogProps) {
  const queryClient = useQueryClient();
  const action = approve ? "Approve" : "Revoke";

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Missing user");
      await approveUser(user.id, approve);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        approve ? "User approved" : "User approval revoked"
      );
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(toUserErrorMessage(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{action} user</DialogTitle>
          <DialogDescription>
            {user
              ? approve
                ? `Approve ${user.name} (${user.email})?`
                : `Revoke approval for ${user.name} (${user.email})?`
              : `${action} this user?`}
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
            variant={approve ? "default" : "destructive"}
            disabled={!user || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? `${action.slice(0, -1)}ing...` : action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
