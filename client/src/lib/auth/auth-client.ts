import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { BACKEND_ORIGIN, BACKEND_URL } from "@/lib/api/config";

/**
 * Better Auth client for the unified backend.
 *
 * One session powers the whole app (storefront + ADMIN/VENDOR/CUSTOMER areas).
 * The backend exposes Better Auth at /api/auth (bearer plugin:
 * POST /api/auth/sign-in/email).
 */
export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? BACKEND_ORIGIN || BACKEND_URL
      : BACKEND_URL,
  basePath: "/api/auth",
  plugins: [
    // The backend extends the Better Auth user model with a `role` field
    // (ADMIN/VENDOR/CUSTOMER) and an `isApproved` flag for vendors.
    // Declare them here so `user.role` / `user.isApproved` are typed. They are
    // assigned server-side (role defaults to CUSTOMER on signup), so they are
    // not part of the sign-up/sign-in input.
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false, input: false },
        isApproved: { type: "boolean", input: false },
      },
    }),
  ],
});

export { SESSION_COOKIE } from "@/lib/api/config";

/**
 * Returns the current Better Auth session token from the browser session.
 * Used by the API client to attach the bearer token automatically.
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { data } = await authClient.getSession();
    return data?.session?.token ?? null;
  } catch {
    return null;
  }
}
