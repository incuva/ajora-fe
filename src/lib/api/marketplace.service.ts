import apiClient from "./axios";

import type {
  Pool,
  ReservationPayload,
  MakePaymentPayload,
  MakePaymentResult,
  ApiResponse,
  PoolReservation,
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
 * Dummy: always returns reserved=true with a mock callbackUrl.
 */
export async function makePayment(
  payload: MakePaymentPayload,
): Promise<MakePaymentResult> {
  // Real API call (uncomment when ready)
  // const { data } = await apiClient.post<MakePaymentResult>("/reservations/payment", payload);
  // return data;

  await simulateDelay(800);

  if (payload.fullName.toLowerCase().trim().startsWith("fail")) {
    return {
      reserved: false,
      message: "Reservation not found. Please verify details.",
    };
  }

  return {
    reserved: true,
    callbackUrl: `/marketplace/${payload.poolId}?status=success`,
    message: "Reservation found. Redirecting to payment.",
  };
}

// Utilities

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
