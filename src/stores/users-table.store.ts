import { create } from "zustand";
import { apiGet, type PaginatedResponse } from "@/lib/api";

// Types

export type UserStatus = "active" | "flagged" | "suspended";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  userId: string;
  poolsParticipation: number;
  amountSpent: number;
  dateJoined: string;
  status: UserStatus;
}

// Mock helpers

const MOCK_NAMES = [
  "Jinadu Kamaru",
  "Aisha Bello",
  "Ibrahim Musa",
  "Fatima Ahmed",
  "Chukwuemeka Osei",
  "Ngozi Adeyemi",
  "Tunde Bakare",
  "Amaka Okonkwo",
];

const MOCK_STATUSES: UserStatus[] = [
  "active",
  "active",
  "active",
  "flagged",
  "suspended",
];

function generateMockUsers(count: number, page: number): User[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (page - 1) * count + i;
    const num = String(idx + 1).padStart(4, "0");
    return {
      id: `user-${idx}`,
      name: MOCK_NAMES[idx % MOCK_NAMES.length],
      avatar: undefined,
      userId: `#AJ${num}`,
      poolsParticipation: 5 + (idx % 20),
      amountSpent: (1 + (idx % 10)) * 5000,
      dateJoined: "April 14th",
      status: MOCK_STATUSES[idx % MOCK_STATUSES.length],
    };
  });
}

// Store

interface UsersTableState {
  users: User[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  fetchUsers: () => Promise<void>;
}

export const useUsersTableStore = create<UsersTableState>((set, get) => ({
  users: [],
  isLoading: false,
  page: 1,
  pageSize: 10,
  total: 0,
  activeFilter: "all",

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

  fetchUsers: async () => {
    const { page, pageSize, activeFilter } = get();
    set({ isLoading: true });
    try {
      // ── Real API (uncomment when backend is ready) ──────────────────────────
      // const response = await apiGet<PaginatedResponse<User>>("/admin/users", {
      //   page,
      //   pageSize,
      //   status: activeFilter === "all" ? undefined : activeFilter,
      // });
      // set({ users: response.data, total: response.total, isLoading: false });

      // ── Mock ────────────────────────────────────────────────────────────────
      await apiGet("/admin/users", { page, pageSize, status: activeFilter });
      set({ isLoading: false });
    } catch {
      await new Promise((r) => setTimeout(r, 900));
      set({
        users: generateMockUsers(pageSize, page),
        total: 100,
        isLoading: false,
      });
    }
  },
}));
