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
  email?: string;
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

// Admin directory 

/** A row in the admin directory returned by GET /admin/admins. */
export interface AdminAccount {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  role: AdminRole;
}

export interface AdminListQuery {
  page?: number;
  size?: number;
  /** true → only suspended admins, false → only active admins. */
  suspended?: boolean;
  role?: AdminRole | string;
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

/** Distinct from marketplace Pool */
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
  total_pool_value: string;
  total_purchase: string;
}

// Admin pool reservations 

export type ReservationStatus = "pending" | "paid" | "delivered";

/** A single reservation row on a pool. */
export interface AdminPoolReservation {
  fullname: string;
  phone: string;
  no_of_slot: number;
  /** Number of subpools this customer booked (0 when the pool has no subpools). */
  no_of_subpools: number;
  reservation_value: string;
  status: ReservationStatus | string;
  /** "online" | "onsite" — how the customer chose to pay. */
  payment_option: string;
  /** "pickup" | "delivery". */
  delivery: string;
  /** Human-facing order reference (e.g. "AJR-FEXJUHA"); also the id the payment-update route expects. */
  order_id: string;
  created_at: string;
}

/** A subpool line item echoed back by the payment-update endpoint. */
export interface ConfirmedPaymentSubpool {
  name: string;
  price: number;
  quantity: number;
  subpool_id: string;
}

export interface ConfirmOnsitePaymentResult {
  id: string;
  order_id: string;
  reservation_id: string;
  user_id: string;
  pool_id: string;
  reference: string;
  amount: number;
  currency: string;
  /** Order fulfilment status (pending | paid | delivered). */
  status: string;
  payment_status: string;
  payment_option: string;
  delivery: string;
  location: string | null;
  no_of_reservation: number;
  subpools: ConfirmedPaymentSubpool[];
  authorization_url: string | null;
  access_code: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReservationListQuery {
  page?: number;
  size?: number;
  status?: ReservationStatus | string;
}

// Admin orders

/**
 * Fulfilment status of an order; also the set of
 * values accepted by the `order_status` query filter.
 */
export type OrderReservationStatus =
  | "pending"
  | "paid"
  | "delivered"
  | "cancelled";

/** Payment lifecycle state (backend `payment_status`). */
export type OrderPaymentStatus =
  | "paid"
  | "initialized"
  | "failed"
  | "cancelled"
  | string;

export type OrderPaymentMethod = "online" | "onsite" | string;

/** A row in the global orders list (GET /admin/orders) — intentionally lean. */
export interface AdminOrder {
  id: string;
  order_id: string;
  reservation_status: OrderReservationStatus | string;
  payment_status: OrderPaymentStatus;
  payment_method: OrderPaymentMethod;
  no_of_slot: number;
}

/**
 * GET /admin/order/{id} — full order detail.
 * `id` is the order UUID from the list row; the AJR-… reference is NOT accepted.
 */
export interface AdminOrderDetail {
  item: { id: string; name: string; unit: string };
  pool: {
    id: string;
    name: string;
    created_at: string;
    deadline: string;
    image: string;
  };
  order: {
    id: string;
    order_id: string;
    no_of_slot: number;
    payment_status: OrderPaymentStatus;
    payment_method: OrderPaymentMethod;
    total_amount: number;
    delivery: string;
  };
  buyer: { id: string; fullname: string };
}

/** PUT /admin/order/{id}/deliver | /cancel result. */
export interface OrderMutationResult {
  id: string;
  order_id: string;
  status: OrderReservationStatus | string;
}

export interface OrderListQuery {
  page?: number;
  size?: number;
  /** Filters on reservation_status (pending | paid | delivered | cancelled). */
  order_status?: string;
  /** Pool UUID to scope orders to a single pool. */
  pool_id?: string;
}

// Admin dashboard overview 

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

// Admin users 

export type UserState = "active" | "suspended";

/** Monetary/count totals are strings. */
export interface AdminUserSummary {
  id: string;
  fullname: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  total_pool_participation: string;
  total_amount_spent: string;
}

export interface AdminUserDetail extends AdminUserSummary {
  email: string;
  is_guest: string | boolean;
  is_verified: boolean;
}

export interface AdminUserListQuery {
  page?: number;
  size?: number;
  search?: string;
  state?: UserState | string;
}

export interface AdminUserOrder {
  reservation_id: string;
  order_id: string;
  pool_name: string;
  category: string;
  no_of_slot: number;
  /** Monetary total returned as a string. */
  total_amount: string;
  status: ReservationStatus | string;
  payment_option: string;
  delivery: string;
  created_at: string;
}

export interface UserOrderListQuery {
  page?: number;
  size?: number;
  status?: ReservationStatus | string;
}

export interface SuspendUserResult {
  id: string;
  fullname: string;
  is_active: boolean;
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

export type PoolOpenState = "open" | "closed";

export interface SetPoolStatusResult {
  id: string;
  name: string;
  status: PoolStatus | string;
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
