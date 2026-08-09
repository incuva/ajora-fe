import type { Pool, Subpool } from "./marketplace.types";

// Shared enums

export type AdminRole = "admin" | "super-admin";
export type PoolStatus = "open" | "closed" | "filled";

// Entities

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: AdminRole;
  created_at?: string;
  updated_at?: string;
}

// Admin auth payloads

/** POST /admin/login */
export interface AdminLoginPayload {
  email: string;
  password: string;
}

/**
 * Result of a successful login. The API returns a JWT valid for 7 days.
 * NOTE: confirm the exact envelope against a live response — this assumes
 * `{ message, data: { token, admin } }`.
 */
export interface AdminLoginResult {
  token: string;
  admin: Admin;
}

/** POST /admin/signup — one-time first super-admin creation */
export interface AdminSignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

/** POST /admin/new 🔒 — create an additional admin (super-admin only) */
export interface CreateAdminPayload {
  /**
   * Per Swagger this field is required and named `admin`. Its exact meaning is
   * not documented — confirm with the backend (likely a flag or identifier).
   */
  admin: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role?: AdminRole;
}

// Admin pool payloads

/** A subpool created inline as part of POST /admin/pool/create */
export interface CreateSubpoolInput {
  name: string;
  total_slots: number;
  description?: string;
  price?: number;
}

/** POST /admin/pool/create */
export interface CreatePoolPayload {
  name: string;
  description?: string;
  total_slots: number;
  slot_price: number;
  imageUrl?: string;
  total_value: number;
  subpools?: CreateSubpoolInput[];
}

/** PUT /admin/pool/{id} 🔒 — all fields optional (partial update) */
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

/** POST /admin/subpool/add/{poolId} 🔒 */
export interface AddSubpoolPayload {
  name: string;
  description?: string;
  weight_per_slot?: number;
  price: number;
  total_slots: number;
  status?: PoolStatus;
}

/** PUT /admin/subpool/{id} 🔒 — all fields optional (partial update) */
export interface UpdateSubpoolPayload {
  name?: string;
  description?: string;
  price?: number;
  total_slots?: number;
  weight_per_slot?: number;
  status?: PoolStatus;
}

// Re-export the shared entity types the admin services return, so callers can
// import everything admin-related from one module.
export type { Pool, Subpool };
