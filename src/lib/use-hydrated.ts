"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once the
 * component has hydrated. Useful for reading client-only state (e.g. persisted
 * currency/cart) without causing hydration mismatches — and without the
 * `setState`-in-`useEffect` pattern.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
