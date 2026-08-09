import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  Admin,
  AdminLoginPayload,
  AdminLoginResult,
  AdminSignupPayload,
  CreateAdminPayload,
} from "@/lib/types/admin.types";

// Admin auth service — mirrors the axios + ApiResponse<T> pattern in
// marketplace.service.ts. The 🔒 endpoints require a Bearer token, which the
// axios interceptor attaches automatically once useAuthStore has a session.

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
 * POST /admin/signup
 * Create the first super-admin account. Usable only once (server-enforced).
 */
export async function adminSignup(payload: AdminSignupPayload): Promise<Admin> {
  const { data } = await apiClient.post<ApiResponse<Admin>>(
    "/admin/signup",
    payload,
  );
  return data.data;
}

/**
 * POST /admin/new  🔒 bearerAuth (super-admin only)
 * Create an additional admin account.
 */
export async function createAdmin(payload: CreateAdminPayload): Promise<Admin> {
  const { data } = await apiClient.post<ApiResponse<Admin>>(
    "/admin/new",
    payload,
  );
  return data.data;
}
