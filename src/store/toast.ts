"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";
export type Toast = { id: number; message: string; type: ToastType };

type ToastState = {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
};

let counter = 0;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    // Auto-dismiss (handled in the store to avoid setState-in-effect patterns).
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
