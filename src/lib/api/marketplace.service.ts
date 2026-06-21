
// import apiClient from "./axios"; 

import type {
  Pool,
  ReservationPayload,
  ReservationResult,
  MakePaymentPayload,
  MakePaymentResult,
} from "@/lib/types/marketplace.types";

// Dummy Data 

const DUMMY_POOL: Pool = {
  id: "pool-full-cow-001",
  name: "Full Cow",
  description:
    "A healthy, verified Fulani bull purchased collectively and split equally among 7 members.",
  status: "Pool open",
  totalSlots: 7,
  filledSlots: 5,
  pricePerSlot: 85000,
  totalValue: 595000,
  infoNote:
    "Full Cow Pool. This pool purchases one verified Fulani bull shared equally among 7 people. Split Share — every member receives an equal physical portion, sealed and ready for collection. Price is fixed at listing.",
  hasOffals: true,
  offals: [
    { id: "liver", name: "Liver", maxQty: 1, pricePerUnit: 10000 },
    { id: "kidney", name: "Kidney", maxQty: 2, pricePerUnit: 10000 },
    { id: "heart", name: "Heart", maxQty: 3, pricePerUnit: 10000 },
    { id: "tripe", name: "Tripe", maxQty: 5, pricePerUnit: 10000 },
    { id: "head", name: "Head", maxQty: 1, pricePerUnit: 10000 },
    { id: "legs", name: "Legs", maxQty: 4, pricePerUnit: 10000 },
  ],
};

// Service Functions

/**
 * Fetch a single pool by ID.
 * Dummy: returns DUMMY_POOL regardless of id.
 */
export async function getPoolById(id: string): Promise<Pool> {
  // Real API call (uncomment when ready)
  // const { data } = await apiClient.get<Pool>(`/pools/${id}`);
  // return data;

  void id; // suppress unused-variable warning
  await simulateDelay(400);
  return DUMMY_POOL;
}

/**
 * Submit a reservation.
 * Dummy: always returns success with a mock orderId and callbackUrl.
 */
export async function confirmReservation(
  payload: ReservationPayload,
): Promise<ReservationResult> {
  // Real API call (uncomment when ready)
  // const { data } = await apiClient.post<ReservationResult>("/reservations", payload);
  // return data;

  void payload;
  await simulateDelay(800);
  return {
    success: true,
    orderId: "#2345678",
    callbackUrl: "https://checkout.ajora.ng/pay/mock-session-001",
    message: "Reservation confirmed successfully.",
  };
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

  void payload;
  await simulateDelay(800);
  return {
    reserved: true,
    callbackUrl: "https://checkout.ajora.ng/pay/mock-session-002",
    message: "Reservation found. Redirecting to payment.",
  };
}

// Utilities

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
