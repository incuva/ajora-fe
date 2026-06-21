export interface OffalType {
  id: string;
  name: string;
  /** Max quantity available for this offal on this pool */
  maxQty: number;
  /** Price per unit of this offal */
  pricePerUnit: number;
}

export interface Pool {
  id: string;
  name: string;
  description: string;
  /** e.g. "Pool open" | "Pool closed" | "Pool full" */
  status: string;
  totalSlots: number;
  filledSlots: number;
  pricePerSlot: number;
  totalValue: number;
  infoNote: string;
  hasOffals: boolean;
  offals: OffalType[];
  /** Optional image/illustration key */
  imageKey?: string;
}

export type DeliveryMode = "pickup" | "delivery";

export interface OffalsSelection {
  /** Map of offal id → quantity selected */
  [offalId: string]: number;
}

export interface ReservationPayload {
  poolId: string;
  fullName: string;
  whatsappNumber: string;
  deliveryMode: DeliveryMode;
  /** Required when deliveryMode === "delivery" */
  location?: string;
  slotCount: number;
  offalsSelection: OffalsSelection;
}

export interface ReservationResult {
  success: boolean;
  orderId?: string;
  /** If present, navigate to this URL for checkout */
  callbackUrl?: string;
  message?: string;
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
