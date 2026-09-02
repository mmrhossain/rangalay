import {
  ADMIN_ROLE,
  CUSTOMER_ROLE,
  VENDOR_ROLE,
} from "@/lib/api/config";

export const LOGIN_PATH = "/login";

/**
 * Role-based home routing for the unified app.
 *
 * One login form serves the whole app; after sign-in (or on middleware guard)
 * the user is sent to the area matching their Better Auth `role`:
 *   ADMIN    -> /admin     (admin portal)
 *   VENDOR   -> /vendor    (vendor portal)
 *   CUSTOMER -> /account   (customer portal)
 */
export const ROLE_HOME: Record<string, string> = {
  [ADMIN_ROLE]: "/admin",
  [VENDOR_ROLE]: "/vendor",
  [CUSTOMER_ROLE]: "/account",
};

/** Area -> role required to access it. */
export const AREA_ROLE: Record<string, string> = {
  "/admin": ADMIN_ROLE,
  "/vendor": VENDOR_ROLE,
  "/account": CUSTOMER_ROLE,
};

/** Which area prefix a path belongs to, if any. */
export function areaForPath(pathname: string): string | null {
  for (const area of Object.keys(AREA_ROLE)) {
    if (pathname === area || pathname.startsWith(`${area}/`)) {
      return area;
    }
  }
  return null;
}

/** Home path for a role. Unknown roles go to the login page. */
export function homeForRole(role?: string | null): string {
  if (role) {
    const home = ROLE_HOME[role];
    if (home) return home;
  }
  return LOGIN_PATH;
}

/**
 * Where an authenticated vendor should land: the pending page until the admin
 * approves their account, the vendor portal afterwards.
 */
export function vendorHomeForUser(
  isApproved?: boolean | null
): string {
  return isApproved === false ? "/vendor/pending" : "/vendor";
}
