import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export const COUPON_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "DISABLED",
] as const;

export const DISCOUNT_TYPES = [
  "PERCENTAGE",
  "FIXED_AMOUNT",
  "FREE_SHIPPING",
] as const;

export type CouponStatus = (typeof COUPON_STATUSES)[number];
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export type CouponListItem = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: CouponStatus;
  discountType: DiscountType;
  discountValue: number | string;
  minimumOrderAmount?: number | string | null;
  maximumDiscountAmount?: number | string | null;
  usageLimit?: number | null;
  usageCount?: number;
  usageLimitPerCustomer?: number | null;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
};

export type CouponPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CouponListResult = {
  items: CouponListItem[];
  pagination: CouponPagination;
};

export type CouponListParams = {
  page?: number;
  limit?: number;
};

export type CreateCouponBody = {
  code: string;
  name: string;
  description?: string;
  status: CouponStatus;
  discountType: DiscountType;
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number | null;
  usageLimitPerCustomer?: number | null;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
  applicableProductIds: string[];
  applicableCategoryIds: string[];
};

const noStore = { cache: "no-store" as const };

export async function fetchCouponList(
  params: CouponListParams = {}
): Promise<CouponListResult> {
  const res = await dashboardApi.get<Envelope<CouponListResult>>(
    "/api/v1/admin/coupons",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      },
    }
  );
  return res.data;
}

export async function createCoupon(
  body: CreateCouponBody
): Promise<CouponListItem> {
  const res = await dashboardApi.post<Envelope<CouponListItem>>(
    "/api/v1/admin/coupons",
    { body }
  );
  return res.data;
}

export async function updateCoupon(
  id: string,
  body: Partial<CreateCouponBody>
): Promise<CouponListItem> {
  const res = await dashboardApi.put<Envelope<CouponListItem>>(
    `/api/v1/admin/coupons/${id}`,
    { body }
  );
  return res.data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await dashboardApi.delete<Envelope<unknown>>(`/api/v1/admin/coupons/${id}`);
}

export function toCouponErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
