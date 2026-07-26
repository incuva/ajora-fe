import { create } from "zustand";
import type { DeliveryMode, PaymentOption } from "@/lib/types/marketplace.types";

interface ReservationState {
  fullname: string;
  phone: string;
  delivery: DeliveryMode;
  payment_option: PaymentOption;
  location: string;
  setReservationDetails: (details: Partial<Omit<ReservationState, "setReservationDetails" | "resetReservationDetails">>) => void;
  resetReservationDetails: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  fullname: "",
  phone: "",
  delivery: "pickup",
  payment_option: "online",
  location: "",

  setReservationDetails: (details) => {
    set((state) => ({ ...state, ...details }));
  },

  resetReservationDetails: () => {
    set({
      fullname: "",
      phone: "",
      delivery: "pickup",
      payment_option: "online",
      location: "",
    });
  },
}));
