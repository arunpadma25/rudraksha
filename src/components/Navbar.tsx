"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { WishlistNavButton } from "@/components/WishlistButton";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Navbar({ user }: { user: SessionUser | null }) {
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useUI((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Full navigation guarantees the server layout re-renders without the
    // session, so the navbar immediately reflects the logged-out state.
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-brand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Rudraksha Sacred home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-800 lg:flex">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <Link href="/products" className="hover:text-brand-500">Shop</Link>
          <Link href="/products?featured=1" className="hover:text-brand-500">Featured</Link>
          <Link href="/about" className="hover:text-brand-500">About</Link>
        </nav>

        <div className="hidden flex-1 max-w-xs md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CurrencySwitcher />

          <WishlistNavButton />

          <button
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full text-brand-800 hover:bg-brand-100"
            aria-label="Open cart"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          {/* Desktop account area */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-800"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
                >
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full text-brand-800 hover:bg-brand-100 lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <BurgerIcon />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("border-t border-brand-100 bg-brand-50 lg:hidden", menuOpen ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-brand-800">
          <div className="pb-2">
            <SearchBar onSubmitted={() => setMenuOpen(false)} />
          </div>
          <Link href="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Home</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Shop</Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Wishlist</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">About</Link>
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Admin</Link>
              )}
              <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">My Account</Link>
              <button onClick={() => { setMenuOpen(false); logout(); }} className="rounded-lg px-3 py-2 text-left hover:bg-brand-100">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Login / Register</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
