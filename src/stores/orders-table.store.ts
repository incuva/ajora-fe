import { create } from "zustand";
import {
  getOrders,
  deliverOrder,
  cancelOrder,
} from "@/lib/api/admin-orders.service";
import type { AdminOrder, AdminOrderDetail } from "@/lib/types/admin.types";

// Types

/** Fulfilment status shown in the Status column (backend `reservation_status`). */
export type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

/**
 * View-model for the orders table + details overlay. 
 */
export interface Order {
  id: string; // order UUID — used for detail / deliver / cancel
  orderId: string; // human reference, e.g. AJR-4CVE9NG
  status: OrderStatus | string; // reservation_status
  paymentStatus: string; // paid | initialized | failed | cancelled
  paymentMethod: string; // online | onsite
  slot: number;

  // Detail-only (filled from getOrderById) —
  detailLoaded?: boolean;
  poolName?: string;
  poolImage?: string;
  poolCreatedDate?: string;
  poolCreatedTime?: string;
  poolDeadlineDate?: string;
  poolDeadlineTime?: string;
  itemName?: string;
  itemUnit?: string;
  amount?: number;
  delivery?: string;
  buyerName?: string;
  buyerId?: string;
}

// Mapping helpers

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const fmtDate = (iso?: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const fmtTime = (iso?: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

/** List row → table view-model. */
export const mapAdminOrder = (o: AdminOrder): Order => ({
  id: o.id,
  orderId: o.order_id,
  status: o.reservation_status ?? "pending",
  paymentStatus: o.payment_status,
  paymentMethod: o.payment_method,
  slot: num(o.no_of_slot),
});

/** Merge a detail payload into an existing row for the details overlay. */
export const applyOrderDetail = (base: Order, d: AdminOrderDetail): Order => ({
  ...base,
  detailLoaded: true,
  poolName: d.pool?.name,
  poolImage: d.pool?.image,
  poolCreatedDate: fmtDate(d.pool?.created_at),
  poolCreatedTime: fmtTime(d.pool?.created_at),
  poolDeadlineDate: fmtDate(d.pool?.deadline),
  poolDeadlineTime: fmtTime(d.pool?.deadline),
  itemName: d.item?.name,
  itemUnit: d.item?.unit,
  amount: num(d.order?.total_amount),
  delivery: d.order?.delivery,
  paymentStatus: d.order?.payment_status ?? base.paymentStatus,
  paymentMethod: d.order?.payment_method ?? base.paymentMethod,
  slot: num(d.order?.no_of_slot) || base.slot,
  buyerName: d.buyer?.fullname,
  buyerId: d.buyer?.id,
});

// Store

interface OrdersTableState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
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
  /** Deliver/cancel via the API, then reflect the new status locally. */
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

export const useOrdersTableStore = create<OrdersTableState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
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

  updateOrderStatus: async (id, status) => {
    if (status === "delivered") await deliverOrder(id);
    else if (status === "cancelled") await cancelOrder(id);
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },

  fetchOrders: async () => {
    const { page, pageSize, activeFilter, selectedPool } = get();
    set({ isLoading: true, error: null });
    try {
      const res = await getOrders({
        page,
        size: pageSize,
        order_status: activeFilter === "all" ? undefined : activeFilter,
        pool_id: selectedPool === "all" ? undefined : selectedPool,
      });
      set({
        orders: (res.data ?? []).map(mapAdminOrder),
        total: res.pagination?.totalItems ?? res.data?.length ?? 0,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Could not load orders.";
      set({ orders: [], total: 0, isLoading: false, error: message });
    }
  },
}));
