import { create } from "zustand";

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
    set({ users: [], total: 0, isLoading: false });
  },
}));
