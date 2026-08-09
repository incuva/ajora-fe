import { create } from "zustand";
import { apiGet } from "@/lib/api";

// Types

export type OrderStatus = "delivered" | "processing" | "cancelled";

export type PaymentStatus = "paid" | "on-delivery";

export interface Order {
  id: string;
  orderId: string;
  poolName: string;
  categoryName: string;
  categoryAvatar?: string;
  slot: number;
  slotAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // ── Detail fields (Order Details modal) ──
  buyerName: string;
  buyerAvatar?: string;
  itemName: string;
  itemCategory: string;
  itemImage: string;
  quantityLabel: string;
  amount: number;
  deliveryAddress: string;
  poolCreatedDate: string;
  poolCreatedTime: string;
  poolDeadlineDate: string;
  poolDeadlineTime: string;
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

// Item metadata keyed by pool index — keeps the detail view consistent per pool.
const ORDER_ITEMS = [
  { item: "Cow", category: "Meat", image: "/assets/cow.png" },
  { item: "Chicken", category: "Frozen Foods", image: "/assets/chicken.png" },
  { item: "Rice", category: "Grains", image: "/assets/rice.png" },
  { item: "Mackerel", category: "Frozen Foods", image: "/assets/fish.png" },
  { item: "Turkey", category: "Frozen Foods", image: "/assets/chicken.png" },
];

const DELIVERY_ADDRESSES = [
  "12, Olutokun community, Agbowo, Ibadan.",
  "24, Ring Road, Challenge, Ibadan.",
  "7, Bodija Estate, Ibadan.",
  "15, Sango-Eleyele Road, Ibadan.",
];

function generateMockOrders(count: number, page: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (page - 1) * count + i;
    const num = String(idx + 1).padStart(4, "0");
    const buyer = BUYER_NAMES[idx % BUYER_NAMES.length];
    const meta = ORDER_ITEMS[idx % ORDER_ITEMS.length];
    const slotAmount = 20000;
    return {
      id: `order-${idx}`,
      orderId: `#AJ-${num}`,
      poolName: ORDER_POOL_NAMES[idx % ORDER_POOL_NAMES.length],
      categoryName: buyer,
      categoryAvatar: undefined,
      slot: 1,
      slotAmount,
      status: MOCK_STATUSES[idx % MOCK_STATUSES.length],
      paymentStatus: idx % 2 === 0 ? "on-delivery" : "paid",

      // Detail fields
      buyerName: buyer,
      buyerAvatar: undefined,
      itemName: meta.item,
      itemCategory: meta.category,
      itemImage: meta.image,
      quantityLabel: "12 Kg (1 slot)",
      amount: slotAmount,
      deliveryAddress: DELIVERY_ADDRESSES[idx % DELIVERY_ADDRESSES.length],
      poolCreatedDate: "April 14th",
      poolCreatedTime: "12:43 PM",
      poolDeadlineDate: "April 14th",
      poolDeadlineTime: "7:00 PM",
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
  updateOrderStatus: (id: string, status: OrderStatus) => void;
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

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },

  fetchOrders: async () => {
    const { page, pageSize, activeFilter, selectedPool } = get();
    set({ isLoading: true });
    try {
      // const response = await apiGet<PaginatedResponse<Order>>("/admin/orders", {
      //   page,
      //   pageSize,
      //   status: activeFilter === "all" ? undefined : activeFilter,
      //   poolId: selectedPool === "all" ? undefined : selectedPool,
      // });
      // set({ orders: response.data, total: response.total, isLoading: false });

      // Mock 
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
