import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_ORIGIN } from "@/lib/api/config";
import { SESSION_COOKIE } from "@/lib/auth/auth-client";
import {
  AREA_ROLE,
  LOGIN_PATH,
  areaForPath,
  homeForRole,
  vendorHomeForUser,
} from "@/lib/auth/routing";

function redirectTo(request: NextRequest, path: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  const redirect = request.nextUrl.pathname + request.nextUrl.search;
  if (redirect !== "/") {
    url.searchParams.set("redirect", redirect);
  }
  return NextResponse.redirect(url);
}

/**
 * Unified role-based route guard for the whole app.
 *
 * Scoped to the three role areas (/admin, /vendor, /account). The public
 * storefront and /login are untouched. Fail-closed: missing/invalid session
 * gets a redirect to /login, a wrong role gets a redirect to the user's own
 * home, and an unapproved vendor is confined to /vendor/pending. The backend
 * session is verified server-side (never trust the client to self-report).
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const area = areaForPath(pathname);
  if (!area) {
    return NextResponse.next();
  }
  const requiredRole = AREA_ROLE[area];

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionToken) {
    return redirectToLogin(request);
  }

  const origin = BACKEND_ORIGIN;
  if (!origin) {
    // No reachable backend origin configured - fail closed rather than
    // silently granting access.
    return redirectToLogin(request);
  }

  try {
    const res = await fetch(`${origin}/api/auth/get-session`, {
      method: "GET",
      headers: {
        accept: "application/json",
        cookie: `${SESSION_COOKIE}=${sessionToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return redirectToLogin(request);
    }

    const body = await res.json();
    const user = body?.user;
    if (!user) {
      return redirectToLogin(request);
    }

    if (user.role !== requiredRole) {
      // Wrong area for this role - send them to their own area home.
      return redirectTo(request, homeForRole(user.role));
    }

    if (requiredRole === AREA_ROLE["/vendor"] && user.isApproved === false) {
      // Unapproved vendor: only /vendor/pending is reachable.
      if (pathname !== "/vendor/pending") {
        return redirectTo(request, vendorHomeForUser(user.isApproved));
      }
    }

    return NextResponse.next();
  } catch {
    // Backend unreachable - fail closed.
    return redirectToLogin(request);
  }
}

export const config = {
  // NOTE: Next.js requires a static, literal matcher (no variables).
  matcher: ["/admin/:path*", "/vendor/:path*", "/account/:path*"],
};
