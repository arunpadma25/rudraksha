"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ onSubmitted }: { onSubmitted?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?search=${encodeURIComponent(term)}` : "/products");
    onSubmitted?.();
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search rudraksha…"
        aria-label="Search products"
        className="w-full rounded-full border border-brand-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
      />
    </form>
  );
}
