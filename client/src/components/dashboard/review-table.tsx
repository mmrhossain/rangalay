"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";

import { ReviewApproveDialog } from "@/components/admin/reviews/review-approve-dialog";
import { ReviewViewDialog } from "@/components/admin/reviews/review-view-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  commentSnippet,
  fetchAdminReviewList,
  reviewCustomerLabel,
  toReviewErrorMessage,
  type AdminReviewItem,
  type ReviewListResult,
  type ReviewStatusFilter,
} from "@/lib/dashboard-api/reviews";

const PAGE_SIZE = 20;

type Props = {
  initialData: ReviewListResult;
};

export function ReviewTable({ initialData }: Props) {
  const [page, setPage] = useState(initialData.pagination.page);
  const [status, setStatus] = useState<ReviewStatusFilter | "">("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [approving, setApproving] = useState<AdminReviewItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewing, setViewing] = useState<AdminReviewItem | null>(null);

  const query = useQuery({
    queryKey: ["admin-reviews", page, status],
    queryFn: () =>
      fetchAdminReviewList({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
      }),
    initialData:
      page === initialData.pagination.page && status === ""
        ? initialData
        : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = query.data ?? initialData;
  const items = data.items;
  const pagination = data.pagination;

  const columns = useMemo<LegacyColumnDef<AdminReviewItem>[]>(
    () => [
      {
        id: "product",
        header: "Product",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.product?.name ?? "—"}</span>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
          const email = row.original.customerProfile?.user?.email;
          return (
            <div>
              <p>{reviewCustomerLabel(row.original)}</p>
              {email ? (
                <p className="text-xs text-muted-foreground">{email}</p>
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.rating}/5</span>
        ),
      },
      {
        id: "comment",
        header: "Comment",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {commentSnippet(row.original.comment)}
          </span>
        ),
      },
      {
        id: "verified",
        header: "Verified",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.verifiedPurchase ? "Yes" : "No"}
          </span>
        ),
      },
      {
        id: "approved",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex w-fit items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium ${
              row.original.isApproved
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {row.original.isApproved ? "Approved" : "Pending"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setViewing(row.original);
                setViewOpen(true);
              }}
            >
              View
            </Button>
            {row.original.isApproved ? null : (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setApproving(row.original);
                  setApproveOpen(true);
                }}
              >
                Approve
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const table = useLegacyTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={status || "__all__"}
          onValueChange={(v) => {
            setStatus(v === "__all__" ? "" : (v as ReviewStatusFilter));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by status">
            <SelectValue placeholder="All reviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{pagination.total} reviews</p>
      </div>

      {query.isError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 p-4">
          <p className="text-sm">{toReviewErrorMessage(query.error)}</p>
        </div>
      ) : null}

      <div className="rounded-xl border">
        {query.isFetching && !query.isFetched ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages || query.isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <ReviewApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        review={approving}
      />
      <ReviewViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        review={viewing}
      />
    </div>
  );
}
