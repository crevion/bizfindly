import { API_BASE } from "./config";
import { ApiError, extractErrorMessage } from "./errors";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function apiClient<T = unknown>(
  path: string,
  { method = "GET", body, headers = {}, signal }: RequestOptions = {},
): Promise<T> {
  const finalHeaders: Record<string, string> = { ...headers };

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isFormData) {
      payload = body as FormData;
    } else {
      finalHeaders["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: payload,
      signal,
    });
  } catch {
    throw new ApiError("Network error. Please check your connection and try again.", 0, null);
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data, `Request failed (${res.status})`), res.status, data);
  }

  return data as T;
}

export type QueryValue = string | number | boolean | null | undefined;

export function buildQuery(params: object = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
