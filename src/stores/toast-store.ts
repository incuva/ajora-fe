import { create } from "zustand";

// Store

interface ToastStoreState {
  toastOpen: boolean;
  toastType: "success" | "error" | "info";
  toastTitle: string;
  toastMessage: string;
  toastSuccess: (title:string, message:string) => void;
  toastInfo: (title:string, message:string) => void;
  toastError: (title:string, message:string) => void;
  toastClose: () => void;
}

export const useToastStore = create<ToastStoreState>((set, _) => ({
  toastOpen: false,
  toastType: "success",
  toastTitle: "",
  toastMessage: "",

  toastSuccess: (title:string, message:string) => {
    set({ toastOpen: true, toastType: "success", toastTitle: title, toastMessage: message });
    setTimeout(() => {
      set({ toastOpen: false });
    }, 3000);
  },
  toastInfo: (title:string, message:string) => {
    set({ toastOpen: true, toastType: "info", toastTitle: title, toastMessage: message });
    setTimeout(() => {
      set({ toastOpen: false });
    }, 3000);
  },
  toastError: (title:string, message:string) => {
    set({ toastOpen: true, toastType: "error", toastTitle: title, toastMessage: message });
    setTimeout(() => {
      set({ toastOpen: false });
    }, 3000);
  },
  toastClose: () => {
    set({ toastOpen: false });
  },
}));
