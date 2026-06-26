import { create } from "zustand";
import { apiGet } from "@/lib/api";

// Types

export type PoolStatus = "active" | "closed" | "filled" | "distributed";

export interface Pool {
  id: string; 
  name: string;
  category: string;
  slotsFilled: number;
  slotsTotal: number;
  deadline: string;
  slotAmount: number;
  status: PoolStatus;
}

// Mock helpers

const POOL_NAMES = [
  "April Cow meat (B1)",
  "April Chicken (B1)",
  "April Rice (B1)",
  "April Mackerel (B1)",
  "March Goat (A2)",
  "April Turkey (C1)",
  "March Tilapia (B2)",
  "April Beans (A1)",
];

const POOL_CATEGORIES = [
  "Meat",
  "Frozen Foods",
  "Grains",
  "Frozen Foods",
  "Meat",
  "Frozen Foods",
  "Frozen Foods",
  "Grains",
];

const MOCK_STATUSES: PoolStatus[] = [
  "active",
  "active",
  "active",
  "closed",
  "filled",
];

function generateMockPools(count: number, page: number): Pool[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (page - 1) * count + i;
    const slotsFilled = 8 + (idx % 8);
    return {
      id: `pool-${idx}`,
      name: POOL_NAMES[idx % POOL_NAMES.length],
      category: POOL_CATEGORIES[idx % POOL_CATEGORIES.length],
      slotsFilled,
      slotsTotal: 15,
      deadline: "April 14th",
      slotAmount: 12000,
      status: MOCK_STATUSES[idx % MOCK_STATUSES.length],
    };
  });
}

// Store

interface PoolsTableState {
  pools: Pool[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  fetchPools: () => Promise<void>;
}

export const usePoolsTableStore = create<PoolsTableState>((set, get) => ({
  pools: [],
  isLoading: false,
  page: 1,
  pageSize: 10,
  total: 0,
  activeFilter: "all",

  setPage: (page) => {
    set({ page });
    get().fetchPools();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchPools();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchPools();
  },

  fetchPools: async () => {
    const { page, pageSize, activeFilter } = get();
    set({ isLoading: true });
    try {
      // ── Real API (uncomment when backend is ready) ──────────────────────────
      // const response = await apiGet<PaginatedResponse<Pool>>("/admin/pools", {
      //   page,
      //   pageSize,
      //   status: activeFilter === "all" ? undefined : activeFilter,
      // });
      // set({ pools: response.data, total: response.total, isLoading: false });

      // ── Mock ────────────────────────────────────────────────────────────────
      await apiGet("/admin/pools", { page, pageSize, status: activeFilter });
      set({ isLoading: false });
    } catch {
      await new Promise((r) => setTimeout(r, 900));
      set({
        pools: generateMockPools(pageSize, page),
        total: 100,
        isLoading: false,
      });
    }
  },
}));
