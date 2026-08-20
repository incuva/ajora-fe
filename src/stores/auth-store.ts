import { create } from "zustand";
import type { AdminRole, Admin } from "@/lib/types/admin.types";
import { getToken, setToken, clearToken } from "@/lib/auth-token";

/**
 * Decode the admin identity carried in the JWT payload.
 *
 * The token is `header.payload.signature`; the payload is base64url-encoded
 * JSON of the shape `{ admin: { first_name, last_name, email, role, is_active }, iat, exp }`.
 * We only read it to restore the session on reload — the server still verifies
 * the signature on every request, so no trust is placed in this decode.
 */
const decodeAdminFromToken = (
  token: string,
): { role: AdminRole; admin: Admin } | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed = JSON.parse(json) as {
      admin?: Partial<Admin> & { email?: string };
      exp?: number;
    };
    // Reject an expired token so we don't restore a dead session.
    if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
    const a = parsed.admin;
    if (!a?.role) return null;
    return {
      role: a.role,
      admin: {
        first_name: a.first_name ?? "",
        last_name: a.last_name ?? "",
        is_active: true,
        role: a.role,
        email: a.email,
      },
    };
  } catch {
    return null;
  }
};

interface AuthState {
  role: AdminRole | null;
  token: string | null;
  isAuthenticated: boolean;
  admin: Admin | null;

  /** Persist the session after a successful login. */
  setSession: (role: AdminRole, token: string, admin?: Admin | null) => void;
  /** Re-read the persisted token on app start (call once from a client boundary). */
  hydrate: () => void;
  /** Clear the session (logout or 401). */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  token: null,
  isAuthenticated: false,
  admin: null,

  setSession: (role, token, admin) => {
    setToken(token);
    set({ role, token, admin: admin ?? null, isAuthenticated: true });
  },

  hydrate: () => {
    const token = getToken();
    if (!token) {
      set({ token: null, role: null, admin: null, isAuthenticated: false });
      return;
    }
    const decoded = decodeAdminFromToken(token);
    set({
      token,
      isAuthenticated: true,
      role: decoded?.role ?? null,
      admin: decoded?.admin ?? null,
    });
  },

  logout: () => {
    clearToken();
    set({ role: null, token: null, admin: null, isAuthenticated: false });
  },
}));
