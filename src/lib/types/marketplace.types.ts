export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface OffalSlot {
  id: string;
  pool_id: string;
  name: string | null;
  price: number;
  status: 'open' | 'closed' | string; // Strongly typed status with string fallback if dynamic
  total_slots: number;
  available_slots: number;
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  total_slots: number;
  available_slots: number;
  imageUrl: string;
  slot_price: number;
  total_value: number;
  status: 'open' | 'closed' | string; 
  offals: OffalSlot[];
}

export type DeliveryMode = "pickup" | "delivery";

export interface OffalsSelection {
  /** Map of offal id → quantity selected */
  [offalId: string]: {
    name: string | null;
    qty: number;
  };
}

export interface OffalsItem {
  id: string;
  name: string | null;
  quantity: number;
}

export interface ReservationPayload {
  pool_id: string;
  fullname: string;
  phone: string;
  delivery: DeliveryMode;
  /** Required when deliveryMode === "delivery" */
  location?: string;
  no_of_reservation: number;
  offals: OffalsItem[];
}

export interface OffalReservationItem {
  price: number;
  offal_id: string;
  quantity: number;
}

export interface PoolReservation {
  id: string;
  user_id: string;
  pool_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | string;
  delivery: DeliveryMode;
  location: string | null;
  no_of_reservation: number;
  offals: OffalReservationItem[];
  created_at: string; // or Date if transformed
  updated_at: string; // or Date if transformed
}

export interface CheckoutSummary {
  description: string;
  orderId: string;
  slotCount: number;
  offalsLabel: string;
  amount: number;
  callbackUrl: string;
}

export interface MakePaymentPayload {
  poolId: string;
  fullName: string;
  whatsappNumber: string;
}

export interface MakePaymentResult {
  reserved: boolean;
  /** Navigate to this URL if reserved === true */
  callbackUrl?: string;
  message?: string;
}