import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  Admin,
  AdminAccount,
  AdminListQuery,
  AdminLoginPayload,
  AdminLoginResult,
  CreateAdminPayload,
  PaginatedResponse,
} from "@/lib/types/admin.types";

/**
 * POST /admin/login
 * Authenticate an admin. Returns a JWT valid for 7 days plus the admin record.
 */
export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResult> {
  const { data } = await apiClient.post<ApiResponse<AdminLoginResult>>(
    "/admin/login",
    payload,
  );
  return data.data;
}

/**
 * POST /admin/new
 * Create an additional admin account.
 */
export async function createAdmin(payload: CreateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.post<ApiResponse<Admin>>(
    "/admin/new",
    payload,
  );
  return data.data;
}

/**
 * GET /admin/admins  🔒 super-admin
 * Paginated admin directory. Optional filters: `suspended` (boolean) and `role`.
 */
export async function getAdmins(
  query: AdminListQuery = {},
): Promise<PaginatedResponse<AdminAccount>> {
  const { data } = await apiClient.get<PaginatedResponse<AdminAccount>>(
    "/admin/admins",
    { params: query },
  );
  return data;
}

/**
 * Suspend an admin.  🔒 super-admin
 *
 */
export async function suspendAdmin(id: string): Promise<void> {
  await apiClient.patch(`/admin/${id}/suspend`, { admin: id });
}

/**
 * Reinstate a suspended admin.  🔒 super-admin
 *
 */
export async function reinstateAdmin(id: string): Promise<void> {
  await apiClient.put(`/admin/${id}/reinstate`, { admin: id });
}
