export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface Subpool {
  id: string;
  pool_id: string;
  name: string;
  description?: string;
  weight_per_slot?: number;
  price: number;
  status: 'open' | 'closed' | string;
  total_slots: number;
  available_slots: number;
}

export type OffalSlot = Subpool;

export interface Pool {
  id: string;
  name: string;
  description: string;
  total_slots: number;
  available_slots: number;
  weight_per_slot: number;
  imageUrl: string;
  slot_price: number;
  total_value: number;
  status: 'open' | 'closed' | string;
  created_at?: string;
  updated_at?: string;
  subpools: Subpool[];
}

export type DeliveryMode = "pickup" | "delivery";
export type PaymentOption = "online" | "onsite";

export interface SubpoolSelection {
  /** Map of subpool id → selection info */
  [subpoolId: string]: {
    name: string;
    qty: number;
    price: number;
  };
}

export type OffalsSelection = SubpoolSelection;

export interface SubpoolItemPayload {
  id: string;
  quantity: number;
}

export interface ReservationPayload {
  pool_id: string;
  fullname: string;
  phone: string;
  delivery: DeliveryMode;
  payment_option: PaymentOption;
  /** Required when deliveryMode === "delivery" */
  location?: string;
  no_of_reservation: number;
  subpools: SubpoolItemPayload[];
}

export interface SubpoolReservationItem {
  name: string;
  price: number;
  quantity: number;
  subpool_id: string;
}

export type OffalReservationItem = SubpoolReservationItem;

export interface PoolReservation {
  id: string;
  user_id: string;
  pool_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | string;
  delivery: DeliveryMode;
  payment_option: PaymentOption;
  location: string | null;
  no_of_reservation: number;
  order_id: string;
  subpools: SubpoolReservationItem[];
  created_at: string;
  updated_at: string;
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
  pool_id: string;
  fullname: string;
  phone: string;
  email: string;
  callbackUrl: string;
}

export interface MakePaymentResult {
  payment_id: string;
  reservation_id: string;
  reference: string;
  amount: number;
  currency: string;
  payment_link: string;
  status: PaymentStatus;
}
export type PaymentStatus = "paid" | "initialized" | "failed" | "pending" | "overpaid";

export interface ConfirmPaymentResult {
  payment_id: string;
  reservation_id: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}