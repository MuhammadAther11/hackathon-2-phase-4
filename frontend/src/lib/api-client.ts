import { authClient } from "./auth-client";
import { getNetworkErrorMessage } from "./auth-errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class APIError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.detail = detail;
  }
}

// Keep your original function logic
export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = authClient.getSession();
  const userId = session?.data?.user?.id;
  const token = session?.data?.token;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Path logic for Phase III
  let finalEndpoint = endpoint;
  if (userId && endpoint.startsWith("/tasks")) {
    // Backend mounts tasks router at /api prefix: /api/{user_id}/tasks
    finalEndpoint = `/api/${userId}${endpoint}`;
  }
  const url = `${API_BASE_URL}${finalEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      redirect: 'follow',
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.location.href = "/login?message=Session expired.";
        authClient.signOut();
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as Record<string, unknown>)?.detail || `API Error: ${response.status}`;
      throw new APIError(String(errorMessage), response.status, (errorData as Record<string, unknown>)?.detail);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as T;
    }

    return await response.json() as T;
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      throw new APIError(getNetworkErrorMessage(err), 0);
    }
    if (err instanceof APIError) throw err;
    throw err;
  }
}

/** * ✅ ADD THIS: The Object wrapper that components are looking for
 * This maps .post(), .get(), etc. to your apiFetch function
 */
export const apiClient = {
  get: <T>(url: string, options?: RequestInit) =>
    apiFetch<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: any, options?: RequestInit) =>
    apiFetch<T>(url, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  put: <T>(url: string, data?: any, options?: RequestInit) =>
    apiFetch<T>(url, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data)
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    apiFetch<T>(url, { ...options, method: 'DELETE' }),
};