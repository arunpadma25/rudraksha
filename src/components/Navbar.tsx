"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { WishlistNavButton } from "@/components/WishlistButton";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Navbar({ user: initialUser }: { user: SessionUser | null }) {
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useUI((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // The root layout may be served from a static/CDN cache, in which case the
  // server-provided `user` is stale (often null). Reconcile against the live
  // session so the navbar always reflects who is actually logged in.
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data) setUser(data.user ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const accountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!accountOpen) return;
    function onClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

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

          {/* Desktop account menu */}
          <div
            ref={accountRef}
            className="relative hidden lg:block"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <button
              onClick={() => setAccountOpen((o) => !o)}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-brand-800 hover:bg-brand-100",
                accountOpen && "bg-brand-100"
              )}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
            >
              <UserIcon />
            </button>

            <div
              role="menu"
              className={cn(
                "absolute right-0 top-full w-56 pt-2 transition",
                accountOpen ? "visible opacity-100" : "invisible opacity-0"
              )}
            >
              <div className="overflow-hidden rounded-xl border border-brand-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
                {user ? (
                  <>
                    <div className="border-b border-brand-100 px-4 py-3">
                      <p className="text-sm font-semibold text-brand-900">
                        Hi, {user.name.split(" ")[0]}
                      </p>
                      <p className="truncate text-xs text-brand-500">{user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <MenuLink href="/admin" onClick={() => setAccountOpen(false)}>
                        Admin Panel
                      </MenuLink>
                    )}
                    <MenuLink href="/account" onClick={() => setAccountOpen(false)}>
                      My Account
                    </MenuLink>
                    <MenuLink href="/account" onClick={() => setAccountOpen(false)}>
                      My Orders
                    </MenuLink>
                    <MenuLink href="/wishlist" onClick={() => setAccountOpen(false)}>
                      Wishlist
                    </MenuLink>
                    <MenuButton
                      onClick={() => {
                        setAccountOpen(false);
                        openCart();
                      }}
                    >
                      Cart{count > 0 ? ` (${count})` : ""}
                    </MenuButton>
                    <div className="my-1 border-t border-brand-100" />
                    <MenuButton onClick={logout}>Logout</MenuButton>
                  </>
                ) : (
                  <>
                    <MenuLink href="/login" onClick={() => setAccountOpen(false)}>
                      Login
                    </MenuLink>
                    <MenuLink href="/register" onClick={() => setAccountOpen(false)}>
                      Create account
                    </MenuLink>
                    <div className="my-1 border-t border-brand-100" />
                    <MenuLink href="/wishlist" onClick={() => setAccountOpen(false)}>
                      Wishlist
                    </MenuLink>
                    <MenuButton
                      onClick={() => {
                        setAccountOpen(false);
                        openCart();
                      }}
                    >
                      Cart{count > 0 ? ` (${count})` : ""}
                    </MenuButton>
                  </>
                )}
              </div>
            </div>
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
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">Admin Panel</Link>
              )}
              <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">My Account</Link>
              <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-brand-100">My Orders</Link>
              <button onClick={() => { setMenuOpen(false); openCart(); }} className="rounded-lg px-3 py-2 text-left hover:bg-brand-100">Cart{count > 0 ? ` (${count})` : ""}</button>
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

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="block px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
    >
      {children}
    </Link>
  );
}

function MenuButton({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className="block w-full px-4 py-2 text-left text-sm font-medium text-brand-800 hover:bg-brand-50"
    >
      {children}
    </button>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
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
