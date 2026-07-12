import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts, getReviews } from "@/lib/queries";
import { productImageUrl } from "@/lib/utils";
import { env } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { Price } from "@/components/Price";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { WishlistButton } from "@/components/WishlistButton";
import { Stars } from "@/components/Stars";
import { ReviewList } from "@/components/ReviewList";
import { ReviewForm } from "@/components/ReviewForm";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.shortDesc };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(slug, 4);
  const [reviews, user] = await Promise.all([getReviews(product.id), getSessionUser()]);
  const benefits = product.benefits.split("\n").filter(Boolean);

  // Build gallery: default image first, then the rest; fall back to generated SVG.
  const galleryUrls = product.images.map((i) => i.url);
  let galleryImages = product.image
    ? [product.image, ...galleryUrls.filter((u) => u !== product.image)]
    : galleryUrls;
  if (galleryImages.length === 0) galleryImages = [productImageUrl(product)];

  const facts: Array<[string, string | null]> = [
    ["Mukhi (Faces)", product.mukhi > 0 ? `${product.mukhi} Mukhi` : "Special"],
    ["Farm Origin", product.origin],
    ["Cultivation", "Pure organic, chemical-free"],
    ["Ruling Planet", product.rulingPlanet],
    ["Deity", product.deity],
    ["Mantra", product.mantra],
  ];

  // Structured data for rich Google results (price, availability, rating).
  const primaryImage = galleryImages[0];
  const absoluteImage = primaryImage.startsWith("http")
    ? primaryImage
    : `${env.siteUrl}${primaryImage}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: [absoluteImage],
    sku: product.id,
    category: product.mukhi > 0 ? `${product.mukhi} Mukhi Rudraksha` : "Special Rudraksha",
    brand: { "@type": "Brand", name: "Rudraksha Sacred" },
    offers: {
      "@type": "Offer",
      url: `${env.siteUrl}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.priceInr,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.ratingAvg.toFixed(1)),
            reviewCount: product.ratingCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // Escape `<` so product content can't break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav className="mb-6 text-sm text-brand-500">
        <Link href="/" className="hover:text-brand-700">Home</Link> /{" "}
        <Link href="/products" className="hover:text-brand-700">Shop</Link> /{" "}
        <span className="text-brand-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={galleryImages} name={product.name} />

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
            Organically farm-grown · {product.origin}
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-900 sm:text-4xl">{product.name}</h1>

          {product.ratingCount > 0 ? (
            <a href="#reviews" className="mt-2 inline-flex">
              <Stars rating={product.ratingAvg} count={product.ratingCount} size="md" />
            </a>
          ) : (
            <p className="mt-2 text-sm text-brand-400">No reviews yet</p>
          )}

          <div className="mt-4">
            <Price inr={product.priceInr} compareAt={product.compareAtInr} className="text-3xl text-brand-800" />
            <p className="mt-1 text-xs text-brand-400">Inclusive of energisation. Shipping calculated at checkout.</p>
          </div>

          <p className="mt-5 text-brand-700">{product.shortDesc}</p>

          <div className="mt-6 space-y-3">
            <ProductBuyBox
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
            <WishlistButton
              withLabel
              className="w-full"
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
          </div>

          {/* Facts */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-brand-100 bg-brand-50 p-5">
            {facts.map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-brand-400">{label}</dt>
                  <dd className="font-medium text-brand-800">{value}</dd>
                </div>
              ) : null
            )}
          </dl>
        </div>
      </div>

      {/* Description & benefits */}
      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-brand-900">About this Rudraksha</h2>
          <p className="mt-3 leading-relaxed text-brand-700">{product.description}</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-900">Benefits</h2>
          <ul className="mt-3 space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-brand-700">
                <span className="mt-1 text-brand-500">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews */}
      <div id="reviews" className="mt-16 scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-bold text-brand-900">Customer Reviews</h2>
          {product.ratingCount > 0 && (
            <Stars rating={product.ratingAvg} count={product.ratingCount} size="md" />
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReviewList reviews={reviews} />
          </div>
          <div>
            {user ? (
              <ReviewForm key={product.ratingCount} productId={product.id} slug={product.slug} />
            ) : (
              <div className="rounded-2xl border border-brand-100 bg-white p-5 text-center">
                <p className="text-brand-700">Want to share your experience?</p>
                <Link
                  href={`/login?redirect=/products/${product.slug}`}
                  className="mt-3 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Log in to review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-brand-900">You may also like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-12 rounded-xl bg-amber-50 p-4 text-center text-xs text-amber-700">
        Spiritual benefits described are based on traditional belief and are not medical claims.
      </p>
    </div>
  );
}
