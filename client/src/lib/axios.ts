import axios from "axios";

// Public API (no credentials)
export const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
});

// Private API (with credentials)
export const privateApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    withCredentials: true,
});
