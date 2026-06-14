"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useCurrency } from "@/store/currency";
import { formatMoney } from "@/lib/currency";
import { productImageUrl } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const { items, setQuantity, removeItem, subtotalInr } = useCart();
  const currency = useCurrency((s) => s.currency);
  const hydrated = useHydrated();

  const code = hydrated ? currency : "INR";
  const subtotal = subtotalInr();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden
        className={cn(
          "fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <h2 className="font-serif text-lg font-bold text-brand-900">
            Your Cart {count > 0 && <span className="text-brand-500">({count})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="grid h-9 w-9 place-items-center rounded-full text-brand-700 hover:bg-brand-100"
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-2xl">🛒</div>
            <p className="text-brand-600">Your cart is empty.</p>
            <button
              onClick={closeCart}
              className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 rounded-xl border border-brand-100 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={productImageUrl(item)}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm font-semibold text-brand-800 hover:text-brand-600"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-brand-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-brand-200">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center text-brand-700 hover:bg-brand-50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center text-brand-700 hover:bg-brand-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-brand-800" suppressHydrationWarning>
                        {formatMoney(item.priceInr * item.quantity, code)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-brand-100 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-brand-600">Subtotal</span>
                <span className="font-serif text-lg font-bold text-brand-900" suppressHydrationWarning>
                  {formatMoney(subtotal, code)}
                </span>
              </div>
              <p className="mb-3 text-xs text-brand-400">Shipping &amp; taxes calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block rounded-xl border border-brand-200 px-6 py-2.5 text-center text-sm font-medium text-brand-700 hover:border-brand-400"
              >
                View Full Cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
