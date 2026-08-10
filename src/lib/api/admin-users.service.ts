import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  AdminUserSummary,
  AdminUserDetail,
  AdminUserListQuery,
  AdminUserOrder,
  UserOrderListQuery,
  SuspendUserResult,
  PaginatedResponse,
} from "@/lib/types/admin.types";

/**
 * GET /admin/users
 * Paginated buyer list with optional search and state (active | suspended).
 */
export async function getAdminUsers(
  query: AdminUserListQuery = {},
): Promise<PaginatedResponse<AdminUserSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminUserSummary>>(
    "/admin/users",
    { params: query },
  );
  return data;
}

/**
 * GET /admin/user/{id}
 * A single buyer's profile (adds email / verification fields to the summary).
 */
export async function getAdminUserById(id: string): Promise<AdminUserDetail> {
  const { data } = await apiClient.get<ApiResponse<AdminUserDetail>>(
    `/admin/user/${id}`,
  );
  return data.data;
}

/**
 * GET /admin/user/{id}/orders
 * Paginated order history for a buyer, with optional status filter
 * (pending | paid | delivered).
 */
export async function getUserOrders(
  id: string,
  query: UserOrderListQuery = {},
): Promise<PaginatedResponse<AdminUserOrder>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminUserOrder>>(
    `/admin/user/${id}/orders`,
    { params: query },
  );
  return data;
}

/**
 * PUT /admin/user/{id}/suspend
 * Toggle a buyer between active and suspended — the server flips the current
 * state and returns the new value, so no body is sent.
 */
export async function toggleUserSuspension(
  id: string,
): Promise<SuspendUserResult> {
  const { data } = await apiClient.put<ApiResponse<SuspendUserResult>>(
    `/admin/user/${id}/suspend`,
  );
  return data.data;
}
