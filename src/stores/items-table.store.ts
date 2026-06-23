import { create } from "zustand";
import { apiGet, type PaginatedResponse } from "@/lib/api";

// Types

export type category =
  | "meat"
  | "poultry"
  | "fish"
  | "grain"
  | "protein"
  | "other";

export interface Items {
  id: string;
  name: string;
  price: string;
  activePools: string;
  img: string;
  category: category;
}

// Mock helpers

const ITEM_NAMES = [
  {
    name: "Cow Meat",
    price: "14,500",
    activePools: "10",
    img: "/assets/cow.png",
    category: "meat",
  },
  {
    name: "Layer Chicken",
    price: "12,000",
    activePools: "10",
    img: "/assets/chicken.png",
    category: "poultry",
  },
  {
    name: "Rice",
    price: "10000",
    activePools: "10",
    img: "/assets/rice.png",
    category: "grain",
  },
  {
    name: "Mackrel Fish",
    price: "8500",
    activePools: "10",
    img: "/assets/fish.png",
    category: "fish",
  },
  {
    name: "Egg",
    price: "12000",
    activePools: "10",
    img: "/assets/eggs.png",
    category: "protein",
  },
];

function generateMockitems(count: number, page: number): Items[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (page - 1) * count + i;
    const num = String(idx + 1).padStart(4, "0");
    return {
      id: `item-${idx}`,
      name: ITEM_NAMES[idx % ITEM_NAMES.length].name,
      price: ITEM_NAMES[idx % ITEM_NAMES.length].price,
      activePools: ITEM_NAMES[idx % ITEM_NAMES.length].activePools,
      img: ITEM_NAMES[idx % ITEM_NAMES.length].img,
      category: ITEM_NAMES[idx % ITEM_NAMES.length].category as category,
    };
  });
}

// Store

interface ItemsTableState {
  items: Items[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  fetchitems: () => Promise<void>;
}

export const useItemsTableStore = create<ItemsTableState>((set, get) => ({
  items: [],
  isLoading: false,
  page: 1,
  pageSize: 15,
  total: 0,
  activeFilter: "all",

  setPage: (page) => {
    set({ page });
    get().fetchitems();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchitems();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchitems();
  },

  fetchitems: async () => {
    const { page, pageSize, activeFilter } = get();
    set({ isLoading: true });
    try {
      // ── Real API (uncomment when backend is ready) ──────────────────────────
      // const response = await apiGet<PaginatedResponse<Order>>("/admin/items", {
      //   page,
      //   pageSize,
      //   status: activeFilter === "all" ? undefined : activeFilter,
      //   poolId: selectedPool === "all" ? undefined : selectedPool,
      // });
      // set({ items: response.data, total: response.total, isLoading: false });

      // ── Mock ────────────────────────────────────────────────────────────────
      await apiGet("/admin/items", {
        page,
        pageSize,
        status: activeFilter,
      });
      set({ isLoading: false });
    } catch {
      await new Promise((r) => setTimeout(r, 900));
      set({
        items: generateMockitems(pageSize, page),
        total: 100,
        isLoading: false,
      });
    }
  },
}));
