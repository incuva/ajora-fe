import { create } from "zustand";
import type { DeliveryMode } from "@/lib/types/marketplace.types";

interface ReservationState {
  fullname: string;
  phone: string;
  delivery: DeliveryMode;
  location: string;
  setReservationDetails: (details: Partial<Omit<ReservationState, "setReservationDetails" | "resetReservationDetails">>) => void;
  resetReservationDetails: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  fullname: "",
  phone: "",
  delivery: "pickup",
  location: "",

  setReservationDetails: (details) => {
    set((state) => ({ ...state, ...details }));
  },

  resetReservationDetails: () => {
    set({
      fullname: "",
      phone: "",
      delivery: "pickup",
      location: "",
    });
  },
}));
