"use client";

import Link from "next/link";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useToast } from "@/store/toast";
import { useCurrency } from "@/store/currency";
import { formatMoney } from "@/lib/currency";
import { productImageUrl } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const addItem = useCart((s) => s.addItem);
  const openCart = useUI((s) => s.openCart);
  const addToast = useToast((s) => s.addToast);
  const currency = useCurrency((s) => s.currency);
  const hydrated = useHydrated();
  const code = hydrated ? currency : "INR";

  function moveToCart(productId: string) {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    addItem(
      {
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        mukhi: item.mukhi,
        priceInr: item.priceInr,
        image: item.image,
        stock: item.stock,
      },
      1
    );
    remove(productId);
    addToast(`${item.name} added to cart`);
    openCart();
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-3xl">♡</div>
        <h1 className="font-serif text-2xl font-bold text-brand-900">Your wishlist is empty</h1>
        <p className="mt-2 text-brand-600">Tap the heart on any product to save it for later.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse Beads
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-brand-900">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4">
            <Link href={`/products/${item.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productImageUrl(item)} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link href={`/products/${item.slug}`} className="font-serif font-semibold text-brand-800 hover:text-brand-600">
                {item.name}
              </Link>
              <span className="text-sm text-brand-500">{item.mukhi > 0 ? `${item.mukhi} Mukhi` : "Special bead"}</span>
              <span className="mt-1 font-semibold text-brand-800" suppressHydrationWarning>
                {formatMoney(item.priceInr, code)}
              </span>
              <div className="mt-auto flex gap-2 pt-3">
                <button
                  onClick={() => moveToCart(item.productId)}
                  disabled={item.stock <= 0}
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-100 disabled:text-brand-400"
                >
                  {item.stock <= 0 ? "Sold Out" : "Add to Cart"}
                </button>
                <button
                  onClick={() => remove(item.productId)}
                  className="rounded-lg border border-brand-200 px-3 py-2 text-sm font-medium text-brand-700 hover:border-brand-400"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
