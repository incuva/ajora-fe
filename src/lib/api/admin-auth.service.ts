import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  Admin,
  AdminLoginPayload,
  AdminLoginResult,
  CreateAdminPayload,
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
