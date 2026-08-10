import { create } from "zustand";
import {
  getAdminUsers,
  toggleUserSuspension,
} from "@/lib/api/admin-users.service";
import type { AdminUserSummary, UserState } from "@/lib/types/admin.types";

// The table row IS the API summary shape.
export type User = AdminUserSummary;
export type { UserState };

/** activeFilter key → the `state` query param the API expects. */
const filterToState = (filter: string): UserState | undefined => {
  if (filter === "active") return "active";
  if (filter === "suspended") return "suspended";
  return undefined;
};

interface UsersTableState {
  users: User[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  search: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  setSearch: (search: string) => void;
  fetchUsers: () => Promise<void>;
  suspendUser: (id: string) => Promise<boolean>;
}

export const useUsersTableStore = create<UsersTableState>((set, get) => ({
  users: [],
  isLoading: false,
  page: 1,
  pageSize: 10,
  total: 0,
  activeFilter: "all",
  search: "",

  setPage: (page) => {
    set({ page });
    get().fetchUsers();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchUsers();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchUsers();
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchUsers();
  },

  // GET /admin/users — server-paginated, with optional search + state filter.
  fetchUsers: async () => {
    const { page, pageSize, activeFilter, search } = get();
    set({ isLoading: true });
    try {
      const res = await getAdminUsers({
        page,
        size: pageSize,
        state: filterToState(activeFilter),
        search: search.trim() || undefined,
      });
      set({
        users: res.data ?? [],
        total: res.pagination?.totalItems ?? res.data?.length ?? 0,
        isLoading: false,
      });
    } catch {
      set({ users: [], total: 0, isLoading: false });
    }
  },

  // PUT /admin/user/{id}/suspend — toggles state; reflect the new value locally.
  suspendUser: async (id) => {
    const result = await toggleUserSuspension(id);
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, is_active: result.is_active } : u,
      ),
    }));
    return result.is_active;
  },
}));
