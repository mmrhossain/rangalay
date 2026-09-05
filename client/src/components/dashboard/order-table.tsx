"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";

import { OrderDetailDialog } from "@/components/admin/orders/order-detail-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  customerLabel,
  fetchOrderList,
  itemCount,
  money,
  ORDER_STATUSES,
  toOrderErrorMessage,
  type OrderListItem,
  type OrderListResult,
  type OrderStatus,
} from "@/lib/dashboard-api/orders";

const PAGE_SIZE = 20;

type Props = {
  initialData: OrderListResult;
};

function dateToIsoStart(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function dateToIsoEnd(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T23:59:59.999Z`).toISOString();
}

function statusClassName(status: OrderStatus): string {
  if (status === "CANCELLED" || status === "REFUNDED") {
    return "bg-destructive text-white";
  }
  if (status === "DELIVERED" || status === "SHIPPED") {
    return "bg-primary text-primary-foreground";
  }
  if (status === "PENDING") {
    return "border-border text-foreground";
  }
  return "bg-secondary text-secondary-foreground";
}

export function OrderTable({ initialData }: Props) {
  const [page, setPage] = useState(initialData.pagination.page);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<OrderListItem | null>(null);

  const from = dateToIsoStart(fromDate);
  const to = dateToIsoEnd(toDate);

  const query = useQuery({
    queryKey: ["admin-orders", page, status, from ?? "", to ?? ""],
    queryFn: () =>
      fetchOrderList({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
        from,
        to,
      }),
    initialData:
      page === initialData.pagination.page && status === "" && !from && !to
        ? initialData
        : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = query.data ?? initialData;
  const items = data.items;
  const pagination = data.pagination;

  const columns = useMemo<LegacyColumnDef<OrderListItem>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{row.original.id}</p>
          </div>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {customerLabel(row.original)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex w-fit items-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium ${statusClassName(row.original.status)}`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "items",
        header: "Items",
        cell: ({ row }) => (
          <span className="tabular-nums">{itemCount(row.original)}</span>
        ),
      },
      {
        id: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="tabular-nums">{money(row.original.grandTotal)}</span>
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(row.original);
              setDetailOpen(true);
            }}
          >
            View
          </Button>
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

  function openRow(order: OrderListItem) {
    setSelected(order);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={status || "__all__"}
            onValueChange={(v) => {
              setStatus(v === "__all__" ? "" : (v as OrderStatus));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-52" aria-label="Filter by status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            aria-label="From date"
            className="w-full sm:w-40"
          />
          <Input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            aria-label="To date"
            className="w-full sm:w-40"
          />
        </div>
        <p className="text-sm text-muted-foreground">{pagination.total} orders</p>
      </div>

      {query.isError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 p-4">
          <p className="text-sm">{toOrderErrorMessage(query.error)}</p>
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
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => openRow(row.original)}
                  >
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

      <OrderDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        order={selected}
      />
    </div>
  );
}
