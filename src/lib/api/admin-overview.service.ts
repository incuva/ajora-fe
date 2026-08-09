import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type { AdminOverview } from "@/lib/types/admin.types";

/**
 * GET /admin/overview
 * Dashboard summary: active-pool count, recent pools, new-user count,
 * total revenue and pending-order count. Requires a Bearer token.
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await apiClient.get<ApiResponse<AdminOverview>>(
    "/admin/overview",
  );
  return data.data;
}
