import apiClient from "./axios";
import type {
  ApiResponse,
  Pool,
  Subpool,
} from "@/lib/types/marketplace.types";
import type {
  CreatePoolPayload,
  UpdatePoolPayload,
  AddSubpoolPayload,
  UpdateSubpoolPayload,
  AdminPoolSummary,
  AdminPoolDetail,
  AdminPoolListQuery,
  AdminPoolReservation,
  ReservationListQuery,
  PoolOpenState,
  SetPoolStatusResult,
  PaginatedResponse,
} from "@/lib/types/admin.types";

/**
 * GET /admin/pools 
 * Paginated admin pool list with optional status/search filters. Returns a
 * summary row per pool (AdminPoolSummary), not the full marketplace Pool shape.
 */
export async function getAdminPools(
  query: AdminPoolListQuery = {},
): Promise<PaginatedResponse<AdminPoolSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminPoolSummary>>(
    "/admin/pools",
    { params: query },
  );
  return data;
}

/**
 * GET /admin/pools/{item_id} 
 * Same as getAdminPools but scoped to a single catalogue item.
 */
export async function getPoolsByItem(
  itemId: string,
  query: AdminPoolListQuery = {},
): Promise<PaginatedResponse<AdminPoolSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminPoolSummary>>(
    `/admin/pools/${itemId}`,
    { params: query },
  );
  return data;
}

/**
 * GET /admin/pool/{id} 
 * Admin pool detail (AdminPoolDetail shape: pool_name, item_name, unit,
 * totals). Distinct from the marketplace GET /user/pool/{id} response.
 */
export async function getAdminPoolById(id: string): Promise<AdminPoolDetail> {
  const { data } = await apiClient.get<ApiResponse<AdminPoolDetail>>(
    `/admin/pool/${id}`,
  );
  return data.data;
}

/**
 * GET /admin/pool/{id}/reservations
 * Paginated reservations for a pool, with optional status filter
 * (pending | paid | delivered).
 */
export async function getPoolReservations(
  poolId: string,
  query: ReservationListQuery = {},
): Promise<PaginatedResponse<AdminPoolReservation>> {
  const { data } = await apiClient.get<
    PaginatedResponse<AdminPoolReservation>
  >(`/admin/pool/${poolId}/reservations`, { params: query });
  return data;
}

/**
 * POST /admin/pool/create
 * Create a new pool (and optional inline subpools), initialized as "open".
 */
export async function createPool(payload: CreatePoolPayload): Promise<Pool> {
  const { data } = await apiClient.post<ApiResponse<Pool>>(
    "/admin/pool/create",
    payload,
  );
  return data.data;
}

/**
 * PUT /admin/pool/{id} 
 * Update pool details. Server rejects reducing total_slots below reserved.
 */
export async function updatePool(
  id: string,
  payload: UpdatePoolPayload,
): Promise<Pool> {
  const { data } = await apiClient.put<ApiResponse<Pool>>(
    `/admin/pool/${id}`,
    payload,
  );
  return data.data;
}

/**
 * PUT /admin/pool/{id}/status
 * Open or close a pool. (The swagger documents this under /pool/{id}/status,
 * but the mounted route is under /admin.) Body is { status: "open" | "closed" }.
 */
export async function setPoolStatus(
  id: string,
  status: PoolOpenState,
): Promise<SetPoolStatusResult> {
  const { data } = await apiClient.put<ApiResponse<SetPoolStatusResult>>(
    `/admin/pool/${id}/status`,
    { status },
  );
  return data.data;
}

/**
 * POST /admin/subpool/add/{poolId}  🔒 bearerAuth
 * Create a subpool under a parent pool.
 */
export async function addSubpool(
  poolId: string,
  payload: AddSubpoolPayload,
): Promise<Subpool> {
  const { data } = await apiClient.post<ApiResponse<Subpool>>(
    `/admin/subpool/add/${poolId}`,
    payload,
  );
  return data.data;
}

/**
 * PUT /admin/subpool/{id}  🔒 bearerAuth
 * Update a subpool. Server rejects reducing total_slots below reserved.
 */
export async function updateSubpool(
  id: string,
  payload: UpdateSubpoolPayload,
): Promise<Subpool> {
  const { data } = await apiClient.put<ApiResponse<Subpool>>(
    `/admin/subpool/${id}`,
    payload,
  );
  return data.data;
}
