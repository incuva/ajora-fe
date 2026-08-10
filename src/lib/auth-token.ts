/**
 * Small SSR-safe wrapper around the persisted admin JWT.
 *
 * The token is issued by POST /admin/login (valid 7 days) and attached as a
 * Bearer header by the axios request interceptor (src/lib/api/axios.ts).
 */

const TOKEN_KEY = "ajora_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}
