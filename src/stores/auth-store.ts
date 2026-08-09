import { create } from "zustand";
import type { Admin } from "@/lib/types/admin.types";
import { getToken, setToken, clearToken } from "@/lib/auth-token";

// Store

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;

  /** Persist the session after a successful login. */
  setSession: (admin: Admin, token: string) => void;
  /** Re-read the persisted token on app start (call once from a client boundary). */
  hydrate: () => void;
  /** Clear the session (logout or 401). */
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  token: null,
  isAuthenticated: false,

  setSession: (admin, token) => {
    setToken(token);
    set({ admin, token, isAuthenticated: true });
  },

  hydrate: () => {
    const token = getToken();
    set({ token, isAuthenticated: !!token });
  },

  logout: () => {
    clearToken();
    set({ admin: null, token: null, isAuthenticated: false });
  },
}));
