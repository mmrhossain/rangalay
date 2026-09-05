"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";

import { CouponDeleteDialog } from "@/components/admin/coupons/coupon-delete-dialog";
import { CouponFormDialog } from "@/components/admin/coupons/coupon.dialog";
import { Button } from "@/components/ui/button";
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
  fetchCouponList,
  toCouponErrorMessage,
  type CouponListItem,
  type CouponListResult,
} from "@/lib/dashboard-api/coupons";

const PAGE_SIZE = 20;

type Props = {
  initialData: CouponListResult;
};

function formatDiscount(item: CouponListItem): string {
  const value = Number(item.discountValue);
  if (item.discountType === "PERCENTAGE") {
    return `${Number.isFinite(value) ? value : 0}%`;
  }
  if (item.discountType === "FREE_SHIPPING") {
    return "Free shipping";
  }
  if (!Number.isFinite(value)) return "FIXED";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function usageLabel(item: CouponListItem): string {
  const used = item.usageCount ?? 0;
  if (item.usageLimit == null) return `${used} / —`;
  return `${used} / ${item.usageLimit}`;
}

export function CouponTable({ initialData }: Props) {
  const [page, setPage] = useState(initialData.pagination.page);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCoupon, setEditingCoupon] = useState<CouponListItem | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponListItem | null>(
    null
  );

  const query = useQuery({
    queryKey: ["admin-coupons", page],
    queryFn: () => fetchCouponList({ page, limit: PAGE_SIZE }),
    initialData:
      page === initialData.pagination.page ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = query.data ?? initialData;
  const items = data.items;
  const pagination = data.pagination;

  const columns = useMemo<LegacyColumnDef<CouponListItem>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.code}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.name}</span>
        ),
      },
      {
        id: "discount",
        header: "Discount",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDiscount(row.original)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {row.original.status}
          </span>
        ),
      },
      {
        id: "active",
        header: "Active",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.isActive ? "Yes" : "No"}
          </span>
        ),
      },
      {
        id: "dates",
        header: "Dates",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.startsAt)} – {formatDate(row.original.expiresAt)}
          </span>
        ),
      },
      {
        id: "usage",
        header: "Usage",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {usageLabel(row.original)}
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
                setFormMode("edit");
                setEditingCoupon(row.original);
                setFormOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeletingCoupon(row.original);
                setDeleteOpen(true);
              }}
            >
              Delete
            </Button>
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
        <p className="text-sm text-muted-foreground">
          {pagination.total} coupons
        </p>
        <Button
          type="button"
          onClick={() => {
            setFormMode("create");
            setEditingCoupon(undefined);
            setFormOpen(true);
          }}
        >
          Add Coupon
        </Button>
      </div>

      {query.isError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 p-4">
          <p className="text-sm">{toCouponErrorMessage(query.error)}</p>
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
                    No coupons found.
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

      <CouponFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={formMode === "edit" ? editingCoupon : undefined}
      />
      <CouponDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        coupon={deletingCoupon}
      />
    </div>
  );
}
