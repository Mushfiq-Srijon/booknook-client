
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions extends RequestInit {
    requireAuth?: boolean;
}

export async function apiFetch<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { requireAuth = false, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);

    headers.set("Accept", "application/json");

    if (
        fetchOptions.body &&
        typeof fetchOptions.body === "string"
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (requireAuth) {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("You must be logged in to perform this action.");
        }

        headers.set("Authorization", `Bearer ${data.token}`);
    }

    const normalizedEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    const response = await fetch(
        `${API_BASE_URL}${normalizedEndpoint}`,
        {
            ...fetchOptions,
            headers,
        }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.message || `Request failed with status ${response.status}.`
        );
    }

    return result as T;
}
