/**
 * API Client
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApiParams = Record<string, string | number | boolean | undefined>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiGet<T>(
  endpoint: string,
  params?: ApiParams
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("API_NOT_CONFIGURED");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${getAuthToken()}`,   // add when auth is ready
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
