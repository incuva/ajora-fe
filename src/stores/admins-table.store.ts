import { create } from "zustand";
import {
  getAdmins,
  suspendAdmin,
  reinstateAdmin,
} from "@/lib/api/admin-auth.service";
import type { AdminAccount } from "@/lib/types/admin.types";

// The table row IS the API directory shape.
export type AdminRow = AdminAccount;

/** activeFilter key → the `suspended` query param the API expects. */
const filterToSuspended = (filter: string): boolean | undefined => {
  if (filter === "active") return false;
  if (filter === "suspended") return true;
  return undefined;
};

interface AdminsTableState {
  admins: AdminRow[];
  isLoading: boolean;
  hasLoaded: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  fetchAdmins: () => Promise<void>;
  /** Suspend or reinstate an admin, reflecting the new state locally. */
  toggleSuspend: (admin: AdminRow) => Promise<boolean>;
}

export const useAdminsTableStore = create<AdminsTableState>((set, get) => ({
  admins: [],
  isLoading: false,
  hasLoaded: false,
  page: 1,
  pageSize: 10,
  total: 0,
  activeFilter: "all",

  setPage: (page) => {
    set({ page });
    get().fetchAdmins();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchAdmins();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchAdmins();
  },

  // GET /admin/admins — server-paginated, with an optional suspended filter.
  fetchAdmins: async () => {
    const { page, pageSize, activeFilter } = get();
    set({ isLoading: true });
    try {
      const res = await getAdmins({
        page,
        size: pageSize,
        suspended: filterToSuspended(activeFilter),
      });
      set({
        admins: res.data ?? [],
        total: res.pagination?.totalItems ?? res.data?.length ?? 0,
        isLoading: false,
        hasLoaded: true,
      });
    } catch {
      set({ admins: [], total: 0, isLoading: false, hasLoaded: true });
    }
  },

  toggleSuspend: async (admin) => {
    const nowActive = !admin.is_active;
    if (admin.is_active) {
      await suspendAdmin(admin.id);
    } else {
      await reinstateAdmin(admin.id);
    }
    set((state) => ({
      admins: state.admins.map((a) =>
        a.id === admin.id ? { ...a, is_active: nowActive } : a,
      ),
    }));
    return nowActive;
  },
}));
