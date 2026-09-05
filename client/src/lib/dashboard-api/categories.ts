import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export type CategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  parentId?: string | null;
};

export type CreateCategoryBody = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parentId?: string | null;
};

const noStore = { cache: "no-store" as const };

export async function fetchCategoryList(): Promise<CategoryListItem[]> {
  const res = await dashboardApi.get<Envelope<CategoryListItem[]>>(
    "/api/v1/categories",
    noStore
  );
  return res.data ?? [];
}

export async function createCategory(
  body: CreateCategoryBody
): Promise<CategoryListItem> {
  const res = await dashboardApi.post<Envelope<CategoryListItem>>(
    "/api/v1/admin/categories",
    { body }
  );
  return res.data;
}

export async function updateCategory(
  id: string,
  body: Partial<CreateCategoryBody>
): Promise<CategoryListItem> {
  const res = await dashboardApi.put<Envelope<CategoryListItem>>(
    `/api/v1/admin/categories/${id}`,
    { body }
  );
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await dashboardApi.delete<Envelope<unknown>>(`/api/v1/admin/categories/${id}`);
}

export function toCategoryErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function toCategoryDeleteErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError && err.status === 409) {
    return "This category has products or subcategories. Remove those first.";
  }
  return toCategoryErrorMessage(err);
}
