"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CURRENCY, isCurrencyCode, type CurrencyCode } from "@/lib/currency";

type CurrencyState = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
};

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: DEFAULT_CURRENCY,
      setCurrency: (code) => set({ currency: code }),
    }),
    {
      name: "rk-currency",
      merge: (persisted, current) => {
        const p = persisted as Partial<CurrencyState> | undefined;
        const code = p?.currency && isCurrencyCode(p.currency) ? p.currency : current.currency;
        return { ...current, currency: code };
      },
    }
  )
);
