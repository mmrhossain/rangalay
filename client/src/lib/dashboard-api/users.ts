import { dashboardApi, DashboardApiError } from "./client";

export type Envelope<T> = {
  success: true;
  message: string;
  data: T;
};

export const USER_ROLES = ["CUSTOMER", "ADMIN", "VENDOR"] as const;
export const USER_STATUSES = ["ACTIVE", "INACTIVE", "BLOCKED"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isApproved: boolean;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
};

export type UserPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type UserListResult = {
  items: AdminUserItem[];
  pagination: UserPagination;
};

export type UserListParams = {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
};

const noStore = { cache: "no-store" as const };

export function parseUserRole(value: unknown): UserRole | undefined {
  if (typeof value !== "string") return undefined;
  return USER_ROLES.includes(value as UserRole)
    ? (value as UserRole)
    : undefined;
}

export function parseUserStatus(value: unknown): UserStatus | undefined {
  if (typeof value !== "string") return undefined;
  return USER_STATUSES.includes(value as UserStatus)
    ? (value as UserStatus)
    : undefined;
}

export async function fetchAdminUserList(
  params: UserListParams = {}
): Promise<UserListResult> {
  const res = await dashboardApi.get<Envelope<UserListResult>>(
    "/api/v1/auth/admin/users",
    {
      ...noStore,
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        role: params.role,
        status: params.status,
      },
    }
  );
  return res.data;
}

export async function approveUser(
  id: string,
  isApproved: boolean
): Promise<AdminUserItem> {
  const res = await dashboardApi.post<Envelope<AdminUserItem>>(
    `/api/v1/auth/admin/users/${id}/approve`,
    { body: { isApproved } }
  );
  return res.data;
}

export function toUserErrorMessage(err: unknown): string {
  if (err instanceof DashboardApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
