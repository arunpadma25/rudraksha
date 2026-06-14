"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { formatMoney } from "@/lib/currency";
import { productImageUrl } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalInr } = useCart();
  const currency = useCurrency((s) => s.currency);
  const mounted = useHydrated();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (active) setAuthed(Boolean(d.authenticated));
      })
      .catch(() => {
        if (active) setAuthed(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const code = mounted ? currency : "INR";
  const subtotal = subtotalInr();

  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-3xl">🛒</div>
        <h1 className="font-serif text-2xl font-bold text-brand-900">Your cart is empty</h1>
        <p className="mt-2 text-brand-600">Explore our sacred rudraksha collection.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-brand-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImageUrl(item)}
                alt={item.name}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <Link href={`/products/${item.slug}`} className="font-serif font-semibold text-brand-800 hover:text-brand-600">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-brand-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <span className="text-sm text-brand-500">
                  {item.mukhi > 0 ? `${item.mukhi} Mukhi` : "Special bead"}
                </span>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-brand-200">
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="grid h-9 w-9 place-items-center text-brand-700 hover:bg-brand-50"
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="grid h-9 w-9 place-items-center text-brand-700 hover:bg-brand-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-brand-800" suppressHydrationWarning>
                    {formatMoney(item.priceInr * item.quantity, code)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="font-serif text-xl font-bold text-brand-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-brand-600">
              <span>Subtotal</span>
              <span suppressHydrationWarning>{formatMoney(subtotal, code)}</span>
            </div>
            <div className="flex justify-between text-brand-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-brand-100 pt-4 text-lg font-bold text-brand-900">
            <span>Total</span>
            <span suppressHydrationWarning>{formatMoney(subtotal, code)}</span>
          </div>
          {authed === false ? (
            <>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <span aria-hidden>🔒</span>
                <span>Please log in to place your order.</span>
              </div>
              <Link
                href="/login?redirect=/checkout"
                className="mt-3 block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Login to Checkout
              </Link>
            </>
          ) : (
            <Link
              href="/checkout"
              className="mt-6 block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
            >
              Proceed to Checkout
            </Link>
          )}
          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-brand-600 hover:text-brand-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
