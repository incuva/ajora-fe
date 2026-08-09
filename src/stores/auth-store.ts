import { create } from "zustand";
import type { AdminRole, Admin } from "@/lib/types/admin.types";
import { getToken, setToken, clearToken } from "@/lib/auth-token";

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
    set({ token, isAuthenticated: !!token });
  },

  logout: () => {
    clearToken();
    set({ role: null, token: null, admin: null, isAuthenticated: false });
  },
}));
