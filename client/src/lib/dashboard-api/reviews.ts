import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export type ReviewStatusFilter = "pending" | "approved";

export type AdminReviewItem = {
  id: string;
  rating: number;
  comment?: string | null;
  isApproved: boolean;
  verifiedPurchase: boolean;
  createdAt: string;
  customerProfile?: {
    id?: string;
    customerCode?: string;
    user?: { name?: string | null; email?: string | null } | null;
  } | null;
  product?: { id: string; name: string; slug: string } | null;
};

export type ReviewPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ReviewListResult = {
  items: AdminReviewItem[];
  pagination: ReviewPagination;
};

export type ReviewListParams = {
  page?: number;
  limit?: number;
  status?: ReviewStatusFilter;
};

const noStore = { cache: "no-store" as const };

export async function fetchAdminReviewList(
  params: ReviewListParams = {}
): Promise<ReviewListResult> {
  const res = await dashboardApi.get<Envelope<ReviewListResult>>(
    "/api/v1/admin/reviews",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        status: params.status,
      },
    }
  );
  return res.data;
}

export async function approveReview(id: string): Promise<AdminReviewItem> {
  const res = await dashboardApi.patch<Envelope<AdminReviewItem>>(
    `/api/v1/admin/reviews/${id}/approve`
  );
  return res.data;
}

export function toReviewErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function reviewCustomerLabel(item: AdminReviewItem): string {
  const user = item.customerProfile?.user;
  return user?.name?.trim() || user?.email?.trim() || "—";
}

export function commentSnippet(comment?: string | null, max = 80): string {
  const text = comment?.trim();
  if (!text) return "—";
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
