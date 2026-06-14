"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useToast } from "@/store/toast";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  label = "Add to Cart",
}: {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const addToast = useToast((s) => s.addToast);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;

  function handleAdd() {
    if (soldOut) return;
    addItem(product, quantity);
    addToast(`${product.name} added to cart`);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      disabled={soldOut}
      className={cn(
        "rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        soldOut
          ? "cursor-not-allowed bg-brand-100 text-brand-400"
          : added
          ? "bg-emerald-600 text-white"
          : "bg-brand-600 text-white hover:bg-brand-700",
        className
      )}
    >
      {soldOut ? "Sold Out" : added ? "Added ✓" : label}
    </button>
  );
}
