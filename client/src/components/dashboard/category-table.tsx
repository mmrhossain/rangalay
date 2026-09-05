"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";

import { CategoryDeleteDialog } from "@/components/admin/categories/category-delete-dialog";
import { CategoryFormDialog } from "@/components/admin/categories/category.dialog";
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
  fetchCategoryList,
  toCategoryErrorMessage,
  type CategoryListItem,
} from "@/lib/dashboard-api/categories";

type Props = {
  initialData: CategoryListItem[];
};

function sortWithChildren(items: CategoryListItem[]): CategoryListItem[] {
  const byParent = new Map<string | null, CategoryListItem[]>();
  for (const item of items) {
    const key = item.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(item);
    byParent.set(key, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  const result: CategoryListItem[] = [];
  const walk = (parentId: string | null) => {
    for (const item of byParent.get(parentId) ?? []) {
      result.push(item);
      walk(item.id);
    }
  };
  walk(null);
  for (const item of items) {
    if (!result.some((r) => r.id === item.id)) result.push(item);
  }
  return result;
}

export function CategoryTable({ initialData }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<
    CategoryListItem | undefined
  >();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoryListItem | null>(null);

  const query = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategoryList,
    initialData,
    staleTime: 30_000,
  });

  const items = query.data ?? initialData;
  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.id, item.name);
    return map;
  }, [items]);
  const childCountById = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      if (!item.parentId) continue;
      map.set(item.parentId, (map.get(item.parentId) ?? 0) + 1);
    }
    return map;
  }, [items]);
  const ordered = useMemo(() => sortWithChildren(items), [items]);

  const columns = useMemo<LegacyColumnDef<CategoryListItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.parentId ? "— " : ""}
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.slug}</span>
        ),
      },
      {
        id: "parent",
        header: "Parent",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.parentId
              ? (nameById.get(row.original.parentId) ?? "—")
              : "—"}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        id: "children",
        header: "Children",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {childCountById.get(row.original.id) ?? 0}
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
                setEditingCategory(row.original);
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
                setDeletingCategory(row.original);
                setDeleteOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [nameById, childCountById]
  );

  const table = useLegacyTable({
    data: ordered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} categories
        </p>
        <Button
          type="button"
          onClick={() => {
            setFormMode("create");
            setEditingCategory(undefined);
            setFormOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      {query.isError ? (
        <div role="alert" className="rounded-xl border border-destructive/30 p-4">
          <p className="text-sm">{toCategoryErrorMessage(query.error)}</p>
        </div>
      ) : null}

      <div className="rounded-xl border">
        {query.isFetching && !query.isFetched && items.length === 0 ? (
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
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initialData={formMode === "edit" ? editingCategory : undefined}
        categories={items}
      />
      <CategoryDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deletingCategory}
      />
    </div>
  );
}
