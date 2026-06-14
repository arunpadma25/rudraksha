import Link from "next/link";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
import { WishlistButton } from "@/components/WishlistButton";
import { Stars } from "@/components/Stars";
import { productImageUrl } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  mukhi: number;
  origin: string;
  shortDesc: string;
  priceInr: number;
  compareAtInr: number | null;
  stock: number;
  image: string | null;
  featured: boolean;
  ratingAvg: number;
  ratingCount: number;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const img = productImageUrl(product);

  return (
    <div className="fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="relative block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
            Only {product.stock} left
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
            Sold Out
          </span>
        )}
      </Link>

      <WishlistButton
        className="absolute right-3 top-3"
        item={{
          productId: product.id,
          slug: product.slug,
          name: product.name,
          mukhi: product.mukhi,
          priceInr: product.priceInr,
          image: product.image,
          stock: product.stock,
        }}
      />

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-400">
          Organically grown · {product.origin}
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-brand-800 hover:text-brand-600">
            {product.name}
          </h3>
        </Link>
        {product.ratingCount > 0 && (
          <div className="mt-1">
            <Stars rating={product.ratingAvg} count={product.ratingCount} />
          </div>
        )}
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-brand-600">{product.shortDesc}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <Price inr={product.priceInr} compareAt={product.compareAtInr} className="text-lg text-brand-800" />
        </div>

        <div className="mt-3">
          <AddToCartButton
            className="w-full"
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              mukhi: product.mukhi,
              priceInr: product.priceInr,
              image: product.image,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </div>
  );
}
