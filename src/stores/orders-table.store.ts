import { create } from "zustand";

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
    set({ orders: [], total: 0, isLoading: false });
  },
}));
