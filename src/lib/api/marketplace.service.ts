import apiClient from "./axios";

import type {
  Pool,
  ReservationPayload,
  MakePaymentPayload,
  MakePaymentResult,
  ApiResponse,
  PoolReservation,
  ConfirmPaymentResult,
} from "@/lib/types/marketplace.types";

// Service Functions

/**
 * Fetch a single pool by ID.
 */
export async function getPoolById(id: string): Promise<Pool> {
  const { data } = await apiClient.get<ApiResponse<Pool>>(`/user/pool/${id}`);
  return data.data;
}

/**
 * Get all pools
 * @returns
 */
export async function getPools(): Promise<Pool[]> {
  const { data } = await apiClient.get<ApiResponse<Pool[]>>(`/user/pools`);
  return data.data;
}

/**
 * Submit a reservation.
 *
 */
export async function confirmReservation(
  payload: ReservationPayload,
): Promise<ApiResponse<PoolReservation>> {
  const { data } = await apiClient.post<ApiResponse<PoolReservation>>(
    "/user/reservations/reserve",
    payload,
  );
  return data;
}

/**
 * Trigger the "Make Payment" flow for an existing reservation.
 */
export async function makePayment(
  payload: MakePaymentPayload,
): Promise<ApiResponse<MakePaymentResult>> {
  const { data } = await apiClient.post<ApiResponse<MakePaymentResult>>(
    "/user/reservation/payments/initiate",
    payload,
  );
  return data;
}

/**
 * Confirm payment for an existing reservation.
 * @param reference 
 * @returns 
 */
export async function confirmPayment(
  reference: string,
): Promise<ConfirmPaymentResult> {
  const { data } = await apiClient.get<ApiResponse<ConfirmPaymentResult>>(
    `/user/reservation/payments/verify/${reference}`,
  );
  return data.data;
}
