export class DashboardApiError extends Error {
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
    this.name = "DashboardApiError";
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
  token?: string | null;
  headers?: HeadersInit;
  body?: unknown;
  params?: QueryParams;
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
  signal?: AbortSignal;
};

const normalize = (value: string | undefined): string =>
  value ? value.replace(/\/+$/, "") : "";

function resolveBaseUrl(): string {
  const envUrl = normalize(process.env.NEXT_PUBLIC_DASHBOARD_API_URL);
  if (envUrl) return envUrl;
  if (typeof window === "undefined") return "http://127.0.0.1:5000";
  return "";
}

function buildUrl(path: string, params?: QueryParams): string {
  const base = resolveBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = base
    ? new URL(base + normalizedPath)
    : new URL(normalizedPath, "http://localhost");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return base ? url.toString() : `${url.pathname}${url.search}`;
}

async function resolveToken(
  explicitToken: string | null | undefined
): Promise<string | null> {
  if (explicitToken !== undefined) return explicitToken;
  if (typeof window === "undefined") return null;
  const { getDashboardAuthToken } = await import("./auth-client");
  return getDashboardAuthToken();
}

function parseErrorEnvelope(body: unknown): {
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
  const details = obj.errors ?? obj.fieldErrors ?? obj.details ?? undefined;
  return { message, code, details };
}

async function toApiError(res: Response): Promise<DashboardApiError> {
  let message = res.statusText || "Request failed";
  let code: string | undefined;
  let details: unknown;
  try {
    const parsed = parseErrorEnvelope(await res.json());
    message = parsed.message;
    code = parsed.code;
    details = parsed.details;
  } catch {
    // non-JSON body
  }
  return new DashboardApiError(message, res.status, code, details);
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

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next: options.next,
      signal: options.signal,
    });
  } catch (err) {
    const cause = err instanceof Error ? err.message : "Network request failed";
    throw new DashboardApiError(`Network error: ${cause}`, 0);
  }

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const dashboardApi = {
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
