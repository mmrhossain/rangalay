/**
 * Backend API configuration for the unified app (storefront + ADMIN/VENDOR/
 * CUSTOMER portals all talk to one Express backend).
 *
 * - NEXT_PUBLIC_BACKEND_URL: browser-visible base URL for the backend. In the
 *   single-port preview setup this is a same-origin proxy path (see
 *   next.config.ts rewrites) to avoid CORS.
 * - BACKEND_ORIGIN: server-only absolute backend origin, used by server
 *   components / the typegen script / the Next.js rewrite target.
 */

const normalize = (value: string | undefined): string =>
  value ? value.replace(/\/+$/, "") : "";

export const BACKEND_URL =
  normalize(process.env.NEXT_PUBLIC_BACKEND_URL) || "/backend-proxy";

export const BACKEND_ORIGIN = normalize(process.env.BACKEND_ORIGIN);

/**
 * Roles recognized by the backend (Better Auth `user.role`).
 * The PHP backend is fully removed - this backend serves every role.
 * Overridable via env.
 */
export const ADMIN_ROLE = process.env.BACKEND_ADMIN_ROLE || "ADMIN";
export const VENDOR_ROLE = process.env.BACKEND_VENDOR_ROLE || "VENDOR";
export const CUSTOMER_ROLE = process.env.BACKEND_CUSTOMER_ROLE || "CUSTOMER";

/**
 * Better Auth session cookie name. The storefront auth (src/store/useAuthStore.ts)
 * is localStorage-based ("login_user") and sends no cookies, so the default
 * Better Auth cookie name does not clash with it. Backend runs Better Auth at
 * /api/auth with the default cookie prefix.
 */
export const SESSION_COOKIE = "better-auth.session_token";
