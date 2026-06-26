import { create } from "zustand";
import { apiGet } from "@/lib/api";

// Types

export type OrderStatus = "delivered" | "processing" | "cancelled";

export interface Order {
  id: string;
  orderId: string;
  poolName: string;
  categoryName: string;
  categoryAvatar?: string;
  slot: number;
  slotAmount: number;
  status: OrderStatus;
}

// Mock helpers

const ORDER_POOL_NAMES = [
  "April Cow meat (B1)",
  "April Chicken (B1)",
  "April Rice (B1)",
  "April Mackerel (B1)",
  "April Turkey (C1)",
];

const BUYER_NAMES = [
  "Jinadu Kamaru",
  "Aisha Bello",
  "Ibrahim Musa",
  "Fatima Ahmed",
];

const MOCK_STATUSES: OrderStatus[] = [
  "delivered",
  "delivered",
  "delivered",
  "processing",
  "cancelled",
];

function generateMockOrders(count: number, page: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (page - 1) * count + i;
    const num = String(idx + 1).padStart(4, "0");
    return {
      id: `order-${idx}`,
      orderId: `#AJ-${num}`,
      poolName: ORDER_POOL_NAMES[idx % ORDER_POOL_NAMES.length],
      categoryName: BUYER_NAMES[idx % BUYER_NAMES.length],
      categoryAvatar: undefined,
      slot: 1,
      slotAmount: 12000,
      status: MOCK_STATUSES[idx % MOCK_STATUSES.length],
    };
  });
}

// Store

interface OrdersTableState {
  orders: Order[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  activeFilter: string;
  selectedPool: string;
  // actions
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilter: (filter: string) => void;
  setSelectedPool: (pool: string) => void;
  fetchOrders: () => Promise<void>;
}

export const useOrdersTableStore = create<OrdersTableState>((set, get) => ({
  orders: [],
  isLoading: false,
  page: 1,
  pageSize: 10,
  total: 0,
  activeFilter: "all",
  selectedPool: "all",

  setPage: (page) => {
    set({ page });
    get().fetchOrders();
  },

  setPageSize: (pageSize) => {
    set({ pageSize, page: 1 });
    get().fetchOrders();
  },

  setFilter: (filter) => {
    set({ activeFilter: filter, page: 1 });
    get().fetchOrders();
  },

  setSelectedPool: (pool) => {
    set({ selectedPool: pool, page: 1 });
    get().fetchOrders();
  },

  fetchOrders: async () => {
    const { page, pageSize, activeFilter, selectedPool } = get();
    set({ isLoading: true });
    try {
      // ── Real API (uncomment when backend is ready) ──────────────────────────
      // const response = await apiGet<PaginatedResponse<Order>>("/admin/orders", {
      //   page,
      //   pageSize,
      //   status: activeFilter === "all" ? undefined : activeFilter,
      //   poolId: selectedPool === "all" ? undefined : selectedPool,
      // });
      // set({ orders: response.data, total: response.total, isLoading: false });

      // ── Mock ────────────────────────────────────────────────────────────────
      await apiGet("/admin/orders", {
        page,
        pageSize,
        status: activeFilter,
        poolId: selectedPool,
      });
      set({ isLoading: false });
    } catch {
      await new Promise((r) => setTimeout(r, 900));
      set({
        orders: generateMockOrders(pageSize, page),
        total: 100,
        isLoading: false,
      });
    }
  },
}));
