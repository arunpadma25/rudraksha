"use client";

import Link from "next/link";
import { useWishlist, type WishItem } from "@/store/wishlist";
import { useToast } from "@/store/toast";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Heart toggle used on product cards and detail pages. */
export function WishlistButton({
  item,
  className,
  withLabel = false,
}: {
  item: WishItem;
  className?: string;
  withLabel?: boolean;
}) {
  const toggle = useWishlist((s) => s.toggle);
  const items = useWishlist((s) => s.items);
  const addToast = useToast((s) => s.addToast);
  const hydrated = useHydrated();
  const active = hydrated && items.some((i) => i.productId === item.productId);

  function onClick() {
    toggle(item);
    addToast(active ? "Removed from wishlist" : "Added to wishlist", active ? "info" : "success");
  }

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
          active
            ? "border-brand-500 bg-brand-50 text-brand-700"
            : "border-brand-300 text-brand-700 hover:border-brand-500",
          className
        )}
        aria-pressed={active}
      >
        <span className={active ? "text-red-500" : ""}>
          <HeartIcon filled={active} />
        </span>
        {active ? "Wishlisted" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm transition hover:bg-white",
        active ? "text-red-500" : "text-brand-500",
        className
      )}
    >
      <HeartIcon filled={active} />
    </button>
  );
}

/** Navbar heart with a count badge linking to the wishlist page. */
export function WishlistNavButton() {
  const items = useWishlist((s) => s.items);
  const hydrated = useHydrated();
  const count = hydrated ? items.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label="Wishlist"
      className="relative grid h-10 w-10 place-items-center rounded-full text-brand-800 hover:bg-brand-100"
    >
      <HeartIcon filled={false} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
