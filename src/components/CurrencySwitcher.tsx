"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/store/currency";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const active = CURRENCIES[currency];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-2.5 py-2 text-sm font-medium text-brand-800 hover:border-brand-400"
      >
        <span>{active.flag}</span>
        <span>{active.code}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border border-brand-100 bg-white shadow-lg">
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
            <button
              key={code}
              onClick={() => {
                setCurrency(code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-brand-50",
                code === currency && "bg-brand-50 font-semibold"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{CURRENCIES[code].flag}</span>
                <span>{CURRENCIES[code].label}</span>
              </span>
              <span className="text-brand-500">{code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
