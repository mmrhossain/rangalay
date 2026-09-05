import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";

const normalize = (value: string | undefined): string =>
  value ? value.replace(/\/+$/, "") : "";

const dashboardOrigin =
  normalize(process.env.NEXT_PUBLIC_DASHBOARD_API_URL) ||
  (typeof window === "undefined" ? "http://127.0.0.1:5000" : "");

export const dashboardAuthClient = createAuthClient({
  baseURL: dashboardOrigin || undefined,
  basePath: "/api/v1/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, input: false },
        isApproved: { type: "boolean", input: false },
      },
    }),
  ],
});

export async function getDashboardAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { data } = await dashboardAuthClient.getSession();
    return data?.session?.token ?? null;
  } catch {
    return null;
  }
}
