import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderAddress = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  country: string;
  state?: string | null;
  city: string;
  area?: string | null;
  postalCode?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
};

export type OrderItem = {
  id: string;
  productName: string;
  sku: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  subtotal: number | string;
};

export type OrderCustomer = {
  id: string;
  customerCode: string;
  user?: { email?: string | null; name?: string | null } | null;
};

export type OrderListItem = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus?: string;
  currency?: string;
  subtotal?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  shippingAmount?: number | string;
  grandTotal: number | string;
  createdAt: string;
  items: OrderItem[];
  customerProfile?: OrderCustomer | null;
};

export type OrderDetail = OrderListItem & {
  notes?: string | null;
  billingAddress?: OrderAddress | null;
  shippingAddress?: OrderAddress | null;
  statusHistory?: Array<{
    id: string;
    status: OrderStatus;
    remarks?: string | null;
    createdAt: string;
  }>;
  payments?: Array<{
    id: string;
    method: string;
    status: string;
    amount: number | string;
    createdAt: string;
  }>;
};

export type OrderPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrderListResult = {
  items: OrderListItem[];
  pagination: OrderPagination;
};

export type OrderListParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  from?: string;
  to?: string;
};

export type UpdateOrderStatusBody = {
  status: OrderStatus;
  remarks?: string;
};

const noStore = { cache: "no-store" as const };

export async function fetchOrderList(
  params: OrderListParams = {}
): Promise<OrderListResult> {
  const res = await dashboardApi.get<Envelope<OrderListResult>>(
    "/api/v1/admin/orders",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        status: params.status,
        from: params.from,
        to: params.to,
      },
    }
  );
  return res.data;
}

export async function fetchOrderById(id: string): Promise<OrderDetail> {
  const res = await dashboardApi.get<Envelope<OrderDetail>>(
    `/api/v1/admin/orders/${id}`,
    noStore
  );
  return res.data;
}

export async function updateOrderStatus(
  id: string,
  body: UpdateOrderStatusBody
): Promise<OrderDetail> {
  const res = await dashboardApi.patch<Envelope<OrderDetail>>(
    `/api/v1/admin/orders/${id}/status`,
    { body }
  );
  return res.data;
}

export function toOrderErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function money(value: number | string | null | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(n);
}

export function customerLabel(order: OrderListItem): string {
  const user = order.customerProfile?.user;
  return (
    user?.name?.trim() ||
    user?.email?.trim() ||
    order.customerProfile?.customerCode ||
    "—"
  );
}

export function itemCount(order: Pick<OrderListItem, "items">): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}
