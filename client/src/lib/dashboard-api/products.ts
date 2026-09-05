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
    sku?: string;
    price: number | string;
    compareAtPrice?: number | string | null;
  }>;
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  variants: Array<{
    id: string;
    sku: string;
    price: number | string;
    availableStock?: number;
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

export type CatalogOption = {
  id: string;
  name: string;
  slug: string;
};

export type CreateProductBody = {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  brandId?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
};

export type CreateVariantBody = {
  sku: string;
  price: number;
  isDefault?: boolean;
};

export async function fetchProductBySlug(slug: string): Promise<ProductDetail> {
  const res = await dashboardApi.get<Envelope<ProductDetail>>(
    `/api/v1/products/${slug}`,
    noStore
  );
  return res.data;
}

export async function fetchCategories(): Promise<CatalogOption[]> {
  const res = await dashboardApi.get<Envelope<CatalogOption[]>>(
    "/api/v1/categories",
    noStore
  );
  return res.data ?? [];
}

export async function fetchBrands(): Promise<CatalogOption[]> {
  const res = await dashboardApi.get<Envelope<CatalogOption[]>>(
    "/api/v1/brands",
    noStore
  );
  return res.data ?? [];
}

export async function createProduct(
  body: CreateProductBody
): Promise<{ id: string }> {
  const res = await dashboardApi.post<Envelope<{ id: string }>>(
    "/api/v1/admin/products",
    { body }
  );
  return res.data;
}

export async function updateProduct(
  id: string,
  body: Partial<CreateProductBody>
): Promise<{ id: string }> {
  const res = await dashboardApi.put<Envelope<{ id: string }>>(
    `/api/v1/admin/products/${id}`,
    { body }
  );
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await dashboardApi.delete<Envelope<unknown>>(`/api/v1/admin/products/${id}`);
}

export async function createProductVariant(
  productId: string,
  body: CreateVariantBody
): Promise<{ id: string }> {
  const res = await dashboardApi.post<Envelope<{ id: string }>>(
    `/api/v1/admin/products/${productId}/variants`,
    { body }
  );
  return res.data;
}

export async function updateProductVariant(
  id: string,
  body: Partial<CreateVariantBody>
): Promise<{ id: string }> {
  const res = await dashboardApi.put<Envelope<{ id: string }>>(
    `/api/v1/admin/variants/${id}`,
    { body }
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
