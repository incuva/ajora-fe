import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  AdminOrder,
  AdminOrderDetail,
  OrderListQuery,
  OrderMutationResult,
  PaginatedResponse,
} from "@/lib/types/admin.types";

/**
 * GET /admin/orders
 * Paginated global orders list (one row per reservation). Optional filters:
 * `order_status` (pending | paid | delivered | cancelled) and `pool_id`.
 */
export async function getOrders(
  query: OrderListQuery = {},
): Promise<PaginatedResponse<AdminOrder>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminOrder>>(
    "/admin/orders",
    { params: query },
  );
  return data;
}

/**
 * GET /admin/order/{id}
 * Full order detail (item / pool / order / buyer). `id` is the order UUID from
 * the list row — the AJR-… reference is NOT accepted here.
 */
export async function getOrderById(id: string): Promise<AdminOrderDetail> {
  const { data } = await apiClient.get<ApiResponse<AdminOrderDetail>>(
    `/admin/order/${id}`,
  );
  return data.data;
}

/**
 * PUT /admin/order/{id}/deliver
 * Mark an order as delivered. Backend rule: only `paid` orders may be
 * delivered — others return 400 "Only paid orders can be marked as delivered".
 */
export async function deliverOrder(id: string): Promise<OrderMutationResult> {
  const { data } = await apiClient.put<ApiResponse<OrderMutationResult>>(
    `/admin/order/${id}/deliver`,
  );
  return data.data;
}

/**
 * PUT /admin/order/{id}/cancel
 * Cancel an order; the backend restores the associated pool/subpool slots.
 */
export async function cancelOrder(id: string): Promise<OrderMutationResult> {
  const { data } = await apiClient.put<ApiResponse<OrderMutationResult>>(
    `/admin/order/${id}/cancel`,
  );
  return data.data;
}
