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
 * Retrieve a reservation by its Reservation ID or Order ID.
 * GET /user/reservations/{id}
 */
export async function getReservationById(
  id: string,
): Promise<PoolReservation> {
  const { data } = await apiClient.get<ApiResponse<PoolReservation>>(
    `/user/reservations/${id}`,
  );
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
 * Resolves ONLY when the backend confirms the reservation was created
 * (2xx status, no explicit failure flag, and a reservation record in `data`).
 * Any other outcome throws, so callers must not proceed to payment unless
 * this resolves.
 */
export async function confirmReservation(
  payload: ReservationPayload,
): Promise<ApiResponse<PoolReservation>> {
  const response = await apiClient.post<ApiResponse<PoolReservation>>(
    "/user/reservations/reserve",
    payload,
  );
  const body = response.data;

  const isHttpSuccess = response.status >= 200 && response.status < 300;
  const explicitlyFailed =
    body?.success === false ||
    (typeof body?.status === "string" &&
      ["error", "failed", "fail"].includes(body.status.toLowerCase())) ||
    body?.status === false;
  const hasReservation = Boolean(body?.data && (body.data.id || body.data.order_id));

  if (!isHttpSuccess || explicitlyFailed || !hasReservation) {
    throw new Error(
      body?.message || "We couldn't confirm your reservation. Please try again.",
    );
  }

  return body;
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
