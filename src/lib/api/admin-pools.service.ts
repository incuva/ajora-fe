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
} from "@/lib/types/admin.types";

// Admin pool & subpool service. All 🔒 endpoints require a Bearer token, which
// the axios interceptor attaches automatically once a session exists.

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
 * PUT /admin/pool/{id}  🔒 bearerAuth
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
