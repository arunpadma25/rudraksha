"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useToast } from "@/store/toast";

export function ProductBuyBox({ product }: { product: Omit<CartItem, "quantity"> }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const addToast = useToast((s) => s.addToast);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;
  const max = Math.max(1, product.stock);

  function add() {
    addItem(product, qty);
    addToast(`${product.name} added to cart`);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function buyNow() {
    addItem(product, qty);
    router.push("/checkout");
  }

  if (soldOut) {
    return (
      <div className="rounded-xl bg-brand-100 px-4 py-3 text-center font-semibold text-brand-500">
        Currently Sold Out
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-brand-700">Quantity</span>
        <div className="flex items-center rounded-lg border border-brand-200">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-10 w-10 place-items-center text-lg text-brand-700 hover:bg-brand-50"
            aria-label="Decrease"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold text-brand-800">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            className="grid h-10 w-10 place-items-center text-lg text-brand-700 hover:bg-brand-50"
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <span className="text-xs text-brand-400">{product.stock} in stock</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={add}
          className={`flex-1 rounded-xl px-6 py-3 font-semibold transition ${
            added ? "bg-emerald-600 text-white" : "border border-brand-300 bg-white text-brand-700 hover:border-brand-500"
          }`}
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        <button
          onClick={buyNow}
          className="flex-1 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
