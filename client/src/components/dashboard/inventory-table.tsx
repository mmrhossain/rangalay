"use client";

import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";

import { StockAdjustDialog } from "@/components/admin/inventory/stock-adjust-dialog";
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
  fetchInventoryList,
  LOW_STOCK_THRESHOLD,
  toInventoryErrorMessage,
  type InventoryListItem,
  type InventoryListResult,
} from "@/lib/dashboard-api/inventory";

const PAGE_SIZE = 20;

type Props = {
  initialData: InventoryListResult;
};

function uniqueWarehouses(items: InventoryListItem[]) {
  const map = new Map<string, { id: string; name: string }>();
  for (const item of items) {
    map.set(item.warehouse.id, {
      id: item.warehouse.id,
      name: item.warehouse.name,
    });
  }
  return Array.from(map.values());
}

export function InventoryTable({ initialData }: Props) {
  const [page, setPage] = useState(initialData.pagination.page);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryListItem | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const query = useQuery({
    queryKey: ["admin-inventory", page, warehouseId],
    queryFn: () =>
      fetchInventoryList({
        page,
        limit: PAGE_SIZE,
        warehouseId: warehouseId || undefined,
      }),
    initialData:
      page === initialData.pagination.page && warehouseId === ""
        ? initialData
        : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const data = query.data ?? initialData;
  const warehouses = useMemo(
    () => uniqueWarehouses([...initialData.items, ...data.items]),
    [initialData.items, data.items]
  );

  const items = useMemo(() => {
    if (!search) return data.items;
    return data.items.filter((item) => {
      const name = item.variant.product.name.toLowerCase();
      const sku = item.variant.sku.toLowerCase();
      return name.includes(search) || sku.includes(search);
    });
  }, [data.items, search]);

  const pagination = data.pagination;

  const columns = useMemo<LegacyColumnDef<InventoryListItem>[]>(
    () => [
      {
        id: "product",
        header: "Product",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.variant.product.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.variant.sku}
            </p>
          </div>
        ),
      },
      {
        id: "warehouse",
        header: "Warehouse",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.warehouse.name}
          </span>
        ),
      },
      {
        id: "onHand",
        header: "On hand",
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.quantityOnHand}</span>
        ),
      },
      {
        id: "reserved",
        header: "Reserved",
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.quantityReserved}</span>
        ),
      },
      {
        id: "available",
        header: "Available",
        cell: ({ row }) => {
          const low = row.original.quantityAvailable < LOW_STOCK_THRESHOLD;
          return (
            <span className="inline-flex items-center gap-2 tabular-nums">
              {row.original.quantityAvailable}
              {low ? (
                <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                  Low
                </span>
              ) : null}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setAdjustItem(row.original);
              setAdjustOpen(true);
            }}
          >
            Adjust
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search product or SKU"
            aria-label="Search inventory"
            className="max-w-sm"
          />
          {warehouses.length > 1 ? (
            <Select
              value={warehouseId || "__all__"}
              onValueChange={(v) => {
                setWarehouseId(v === "__all__" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All warehouses</SelectItem>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {pagination.total} records
        </p>
      </div>

      {query.isError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 p-4">
          <p className="text-sm">{toInventoryErrorMessage(query.error)}</p>
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
                    No inventory found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const low =
                    row.original.quantityAvailable < LOW_STOCK_THRESHOLD;
                  return (
                    <TableRow
                      key={row.id}
                      className={low ? "bg-destructive/5" : undefined}
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
                  );
                })
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

      <StockAdjustDialog
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        item={adjustItem}
      />
    </div>
  );
}
