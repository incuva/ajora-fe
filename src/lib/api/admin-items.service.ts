import apiClient from "./axios";
import type { ApiResponse } from "@/lib/types/marketplace.types";
import type {
  Item,
  CreateItemPayload,
  UpdateItemPayload,
} from "@/lib/types/item.types";

// Admin catalogue item service. All endpoints require a Bearer token, which the
// axios interceptor attaches automatically once a session exists.
//
// The list/detail responses are documented only textually in Swagger (no
// content schema), so their `data` shapes are inferred from the create/update
// payloads plus the standard { message, data } envelope. If the server wraps
// the list in pagination like /admin/pools does, revisit getItems().

/**
 * POST /admin/item/create
 * Create a catalogue item (name + unit required).
 */
export async function createItem(payload: CreateItemPayload): Promise<Item> {
  const { data } = await apiClient.post<ApiResponse<Item>>(
    "/admin/item/create",
    payload,
  );
  return data.data;
}

/**
 * GET /admin/items
 * List all catalogue items.
 */
export async function getItems(): Promise<Item[]> {
  const { data } = await apiClient.get<ApiResponse<Item[]>>("/admin/items");
  return data.data ?? [];
}

/**
 * GET /admin/item/{id}
 * Fetch a single catalogue item.
 */
export async function getItemById(id: string): Promise<Item> {
  const { data } = await apiClient.get<ApiResponse<Item>>(`/admin/item/${id}`);
  return data.data;
}

/**
 * PUT /admin/item/{id}
 * Update a catalogue item (any subset of fields).
 */
export async function updateItem(
  id: string,
  payload: UpdateItemPayload,
): Promise<Item> {
  const { data } = await apiClient.put<ApiResponse<Item>>(
    `/admin/item/${id}`,
    payload,
  );
  return data.data;
}

/**
 * DELETE /admin/item/{id}
 * Remove a catalogue item.
 */
export async function deleteItem(id: string): Promise<void> {
  await apiClient.delete(`/admin/item/${id}`);
}
