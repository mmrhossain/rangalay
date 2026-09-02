import { BACKEND_ORIGIN, BACKEND_URL } from "./config";

/**
 * Error thrown by the API client. Carries the backend's consistent error
 * envelope fields (message/code/errors) so UI layers can react to validation
 * failures, auth failures, etc.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type FetchOptions = {
  /** Explicit bearer token. On the client it defaults to the Better Auth session token. */
  token?: string | null;
  headers?: HeadersInit;
  /** JSON-serializable request body (null/undefined means no body). */
  body?: unknown;
  /** URL query parameters, appended automatically. */
  params?: QueryParams;
  /** SSR fetch options (see Task 4 - SSR no-cache strategy). */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  revalidate?: number | false;
  signal?: AbortSignal;
};

/** Resolve the base URL depending on runtime context. */
function resolveBaseUrl(): string {
  // Server-side fetches go straight to the backend origin.
  if (typeof window === "undefined" && BACKEND_ORIGIN) {
    return BACKEND_ORIGIN;
  }
  // Browser fetches use the same-origin proxy path (no CORS).
  return BACKEND_URL;
}

function buildUrl(path: string, params?: QueryParams): string {
  const base = resolveBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(base + normalizedPath);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function resolveToken(
  explicitToken: string | null | undefined
): Promise<string | null> {
  if (explicitToken !== undefined) return explicitToken;
  if (typeof window === "undefined") return null;
  // Lazy import to keep client.ts free of a hard dependency on auth-client.ts.
  const { getAuthToken } = await import("../auth/auth-client");
  return getAuthToken();
}

function parseErrorMessage(body: unknown): {
  message: string;
  code?: string;
  details?: unknown;
} {
  const fallback = { message: "Request failed" };
  if (typeof body !== "object" || body === null) return fallback;
  const obj = body as Record<string, unknown>;
  const message =
    typeof obj.message === "string"
      ? obj.message
      : typeof obj.error === "string"
        ? obj.error
        : fallback.message;
  const code = typeof obj.code === "string" ? obj.code : undefined;
  // Backend envelope: { success:false, message, fieldErrors } (see ErrorResponse
  // schema in openapi-dashboard.json). Better Auth errors use { code, message }.
  const details =
    obj.fieldErrors ?? obj.errors ?? obj.details ?? undefined;
  return { message, code, details };
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = res.statusText || "Request failed";
  let code: string | undefined;
  let details: unknown;
  try {
    const body = await res.json();
    const parsed = parseErrorMessage(body);
    message = parsed.message;
    code = parsed.code;
    details = parsed.details;
  } catch {
    // Non-JSON error body; keep statusText.
  }
  return new ApiError(message, res.status, code, details);
}

async function apiRequest<T>(
  method: string,
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = buildUrl(path, options.params);
  const token = await resolveToken(options.token);

  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  let next: Record<string, unknown> | undefined;
  if (options.revalidate !== undefined) {
    next = { revalidate: options.revalidate };
  } else if (options.next) {
    next = { ...options.next };
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next,
      signal: options.signal,
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const cause =
      err instanceof Error ? err.message : "Network request failed";
    throw new ApiError(`Network error: ${cause}`, 0);
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

/** Typed HTTP client for the unified backend. */
export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    apiRequest<T>("GET", path, options),
  post: <T>(path: string, options?: FetchOptions) =>
    apiRequest<T>("POST", path, options),
  put: <T>(path: string, options?: FetchOptions) =>
    apiRequest<T>("PUT", path, options),
  patch: <T>(path: string, options?: FetchOptions) =>
    apiRequest<T>("PATCH", path, options),
  delete: <T>(path: string, options?: FetchOptions) =>
    apiRequest<T>("DELETE", path, options),
};
