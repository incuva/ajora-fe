import type { Pool, Subpool } from "./marketplace.types";

// Shared enums

export type AdminRole = "admin" | "super-admin";
export type PoolStatus = "open" | "closed" | "filled";

// Entities

export interface Admin {
  first_name: string;
  last_name: string;
  is_active: true;
  role: AdminRole;
}

// Admin auth payloads
export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResult {
  token: string;
  first_name: string;
  last_name: string;
  is_active: true;
  role: AdminRole;
}
export interface CreateAdminPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role?: AdminRole;
}

// Admin pool list 

/** Summary row returned by the admin pool-list endpoints. */
export interface AdminPoolSummary {
  id: string;
  pool_name: string;
  category: string;
  total_slots: number;
  available_slots: number;
  slot_amount: number;
  status: PoolStatus | string;
  deadline?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface AdminPoolListQuery {
  page?: number;
  size?: number;
  status?: PoolStatus | string;
  search?: string;
}

/** Detail shape returned by GET /admin/pool/{id} (distinct from marketplace Pool). */
export interface AdminPoolDetail {
  id: string;
  pool_name: string;
  item_name: string;
  available_slots: number;
  total_slots: number;
  weight_per_slot: number;
  unit: string;
  created_at: string;
  deadline?: string;
  /** Server returns these monetary totals as strings (e.g. "620000"). */
  total_pool_value: string;
  total_purchase: string;
}

// Admin pool reservations (GET /admin/pool/{id}/reservations)

export type ReservationStatus = "pending" | "paid" | "delivered";

/** A single reservation row on a pool. */
export interface AdminPoolReservation {
  fullname: string;
  phone: string;
  no_of_slot: number;
  /** Monetary value returned as a string (e.g. "19976"). */
  reservation_value: string;
  status: ReservationStatus | string;
  payment_option: string;
  delivery: string;
  order_id: string;
  created_at: string;
}

export interface ReservationListQuery {
  page?: number;
  size?: number;
  status?: ReservationStatus | string;
}

// Admin dashboard overview (GET /admin/overview)

export interface OverviewMetric {
  total: number;
  change_percentage: number;
  trend: "increase" | "decrease" | string;
}

export interface OverviewRecentPool {
  id: string;
  name: string;
  category: string;
  total_slots: number;
  available_slots: number;
  slot_price: number;
  status: PoolStatus | string;
  deadline?: string;
  created_at: string;
}

export interface OverviewNewUsers {
  total_last_30_days: number;
  change_percentage: number;
  trend: "increase" | "decrease" | string;
}

export interface AdminOverview {
  active_pools: OverviewMetric;
  recent_pools: OverviewRecentPool[];
  new_users: OverviewNewUsers;
  total_revenue: number;
  pending_orders: number;
}

// Admin pool payloads

export interface CreateSubpoolInput {
  name: string;
  total_slots: number;
  description?: string;
  price?: number;
}

export interface CreatePoolPayload {
  name: string;
  /** Catalogue item this pool draws from (required). */
  item_id: string;
  description?: string;
  /** ISO 8601 date-time. */
  deadline?: string;
  /** ISO 8601 date-time — when the pool starts. */
  start_date?: string;
  total_slots: number;
  slot_price: number;
  imageUrl?: string;
  total_value: number;
  subpools?: CreateSubpoolInput[];
}

export interface UpdatePoolPayload {
  name?: string;
  description?: string;
  total_slots?: number;
  slot_price?: number;
  imageUrl?: string;
  total_value?: number;
  weight_per_slot?: number;
  status?: PoolStatus;
}

// Admin subpool payloads

export interface AddSubpoolPayload {
  name: string;
  description?: string;
  weight_per_slot?: number;
  price: number;
  total_slots: number;
  status?: PoolStatus;
}

export interface UpdateSubpoolPayload {
  name?: string;
  description?: string;
  price?: number;
  total_slots?: number;
  weight_per_slot?: number;
  status?: PoolStatus;
}

export type { Pool, Subpool };
