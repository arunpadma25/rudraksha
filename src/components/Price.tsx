"use client";

import { useCurrency } from "@/store/currency";
import { formatMoney } from "@/lib/currency";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function Price({
  inr,
  className,
  compareAt,
}: {
  inr: number;
  className?: string;
  compareAt?: number | null;
}) {
  const currency = useCurrency((s) => s.currency);
  const hydrated = useHydrated();

  // Render INR on the server / first paint to avoid hydration mismatch,
  // then switch to the customer's chosen currency after hydration.
  const code = hydrated ? currency : "INR";

  return (
    <span className="inline-flex items-baseline gap-2" suppressHydrationWarning>
      <span className={cn("font-semibold", className)}>{formatMoney(inr, code)}</span>
      {compareAt && compareAt > inr && (
        <span className="text-sm font-normal text-brand-400 line-through">
          {formatMoney(compareAt, code)}
        </span>
      )}
    </span>
  );
}
