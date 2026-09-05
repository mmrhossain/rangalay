import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export const LOW_STOCK_THRESHOLD = 10;

export type InventoryListItem = {
  id: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  warehouseId: string;
  variantId: string;
  warehouse: { id: string; name: string; code: string };
  variant: {
    id: string;
    sku: string;
    product: { id: string; name: string; slug: string };
  };
};

export type InventoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type InventoryListResult = {
  items: InventoryListItem[];
  pagination: InventoryPagination;
};

export type InventoryListParams = {
  page?: number;
  limit?: number;
  warehouseId?: string;
};

export type CreateAdjustmentBody = {
  warehouseId: string;
  variantId: string;
  difference: number;
  reason: string;
};

export type AdjustmentRecord = {
  id: string;
  difference: number;
  adjustedQuantity: number;
  status: string;
};

const noStore = { cache: "no-store" as const };

export async function fetchInventoryList(
  params: InventoryListParams = {}
): Promise<InventoryListResult> {
  const res = await dashboardApi.get<Envelope<InventoryListResult>>(
    "/api/v1/admin/inventory",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        warehouseId: params.warehouseId || undefined,
      },
    }
  );
  return res.data;
}

export async function createInventoryAdjustment(
  body: CreateAdjustmentBody
): Promise<AdjustmentRecord> {
  const res = await dashboardApi.post<Envelope<AdjustmentRecord>>(
    "/api/v1/admin/inventory/adjustments",
    { body }
  );
  return res.data;
}

export async function approveInventoryAdjustment(
  id: string
): Promise<AdjustmentRecord> {
  const res = await dashboardApi.post<Envelope<AdjustmentRecord>>(
    `/api/v1/admin/inventory/adjustments/${id}/approve`,
    { body: { approved: true } }
  );
  return res.data;
}

export function toInventoryErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
