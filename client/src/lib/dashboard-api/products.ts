import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  isFeatured: boolean;
  averageRating?: number | null;
  reviewCount?: number | null;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  images: Array<{ imageUrl: string }>;
  variants: Array<{
    id: string;
    price: number | string;
    compareAtPrice?: number | string | null;
  }>;
};

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductListResult = {
  items: ProductListItem[];
  pagination: ProductPagination;
};

export type ProductListParams = {
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
};

const noStore = { cache: "no-store" as const };

export async function fetchProductList(
  params: ProductListParams = {}
): Promise<ProductListResult> {
  const res = await dashboardApi.get<Envelope<ProductListResult>>(
    "/api/v1/products",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        includeInactive: params.includeInactive ?? true,
        sort: "newest",
      },
    }
  );
  return res.data;
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function productPrice(item: ProductListItem): number | null {
  const prices = item.variants
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n));
  if (prices.length === 0) return null;
  return Math.min(...prices);
}
