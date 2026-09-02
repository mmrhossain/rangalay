import { publicApi, privateApi } from "@/lib/axios";
import {Options} from "@/types/api";
import {baseURL, buildQueryString} from "@/utils";

type ApiErrorResponse = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>
        }
    }
};

type ErrorWithErrors = {
    message: string;
    errors: Record<string, string[]>;
};

const getErrorMessage = (err: unknown): string | ErrorWithErrors => {
    if (typeof err === "object" && err !== null && "response" in err) {
        const resp = (err as ApiErrorResponse).response;

        if (resp?.data?.errors) {
            return {
                message: resp.data.message || "Validation Error",
                errors: resp.data.errors
            };
        }

        const message = resp?.data?.message;
        if (typeof message === "string" && message.trim()) {
            return message;
        }
    }

    if (err instanceof Error) {
        return err.message;
    }

    return "Request failed";
};



// Generic GET
export async function getData<T>(endpoint: string, options: Options = {}): Promise<T> {
    try {
        // Build URL with query params if provided
        const query = buildQueryString(options?.params)
        const url = baseURL + endpoint;

        const res = await fetch(url
            + query, {
            headers: options.headers,
            cache: options.cache,
            next: options.next ? { revalidate: options.next.revalidate } : undefined,
            credentials: options.credentials,
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: T = await res.json();
        return data;
    } catch (err: unknown) {
        throw getErrorMessage(err);
    }
}

// Generic POST
export async function postData<T>(endpoint : string, options?: Options): Promise<T> {
    const api = options?.withCredentials ? privateApi : publicApi;
    const query = buildQueryString(options?.params)
    try {
        const res = await api.post<T>(endpoint + query);
        return res?.data;
    } catch (err: unknown) {
        throw getErrorMessage(err);
    }
}

// Generic PUT
export async function putData<T>(endpoint : string, options?: Options): Promise<T> {
    const api = options?.withCredentials ? privateApi : publicApi;
    const query = buildQueryString(options?.params)

    try {
        const res = await api.put<T>(endpoint + query);
        return res?.data;
    } catch (err: unknown) {
        throw getErrorMessage(err);
    }
}

// Generic DELETE
export async function deleteData<T>(endpoint: string, options?: Options): Promise<T> {
    const api = options?.withCredentials ? privateApi : publicApi;
    const query = buildQueryString(options?.params)

    try {
        const res = await api.delete<T>(endpoint + query);
        return res?.data;
    } catch (err: unknown) {
        throw getErrorMessage(err);
    }
}
