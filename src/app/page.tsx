import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="fade-up">
            <span className="inline-block rounded-full bg-brand-600/10 px-3 py-1 text-sm font-semibold text-brand-700">
              Home-grown · Pure Organic · Worldwide Shipping
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-brand-900 sm:text-5xl">
              Farm-Fresh Rudraksha,
              <br />
              <span className="text-brand-600">Grown with Devotion</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-brand-700">
              Genuine 1 to 14 Mukhi rudraksha and rare specials, lovingly home-grown on our own
              organic farm near Mangalore, Karnataka. 100% chemical-free, hand-harvested, and
              energised — shipped in your currency, anywhere in the world.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
              >
                Shop All Beads
              </Link>
              <Link
                href="/products?featured=1"
                className="rounded-xl border border-brand-300 bg-white px-6 py-3 font-semibold text-brand-700 transition hover:border-brand-500"
              >
                View Featured
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-600">
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★★★★★</span>
                <span className="font-medium">Loved by devotees worldwide</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-600">✓</span> Free shipping over ₹2,500
              </span>
            </div>
          </div>

          <div className="relative mx-auto fade-up">
            <div className="absolute inset-0 -z-0 mx-auto my-auto h-64 w-64 rounded-full bg-brand-300/40 blur-3xl sm:h-80 sm:w-80" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/product-image?mukhi=5&label=Rudraksha"
              alt="Rudraksha bead"
              className="relative mx-auto w-72 rounded-full shadow-2xl sm:w-96"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-brand-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 text-center md:grid-cols-4">
          {[
            { t: "Our Own Farm", d: "Grown in Mangalore, Karnataka" },
            { t: "100% Organic", d: "No chemicals, hand-harvested" },
            { t: "Multi-currency", d: "Pay in INR, USD & more" },
            { t: "Worldwide Shipping", d: "India & international" },
          ].map((b) => (
            <div key={b.t}>
              <div className="font-serif text-lg font-bold text-brand-800">{b.t}</div>
              <div className="text-sm text-brand-500">{b.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Farm story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          {/* Visual — swap this block for a real farm photo when available */}
          <div className="order-2 md:order-1">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-brand-50 to-amber-100 p-8 shadow-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                📍 Our farm · Mangalore, Karnataka
              </span>
              <div className="mt-6 flex items-center justify-center gap-3">
                {[3, 6, 0].map((m, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={`/api/product-image?mukhi=${m}&label=Farm`}
                    alt="Rudraksha from our farm"
                    className={`rounded-full border-4 border-white shadow-lg ${i === 1 ? "h-32 w-32" : "h-24 w-24"}`}
                  />
                ))}
              </div>
              <blockquote className="mt-6 text-center font-serif text-xl font-semibold text-brand-800">
                “From our soil to your soul.”
              </blockquote>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <span className="inline-block rounded-full bg-emerald-600/10 px-3 py-1 text-sm font-semibold text-emerald-700">
              Our Story
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-900">
              Grown on our own family farm
            </h2>
            <p className="mt-3 leading-relaxed text-brand-700">
              We are a family-run rudraksha farm in the lush hills near Mangalore, Karnataka. Every
              bead is raised by our own hands — from sapling to harvest — with patience, prayer, and
              pure organic care. No traders, no middlemen, just honest beads with a story you can trust.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icon: "🌱", t: "Home-grown saplings", d: "Nurtured on our own land, season after season." },
                { icon: "🚫", t: "Zero chemicals", d: "No pesticides or artificial treatments — ever." },
                { icon: "✋", t: "Hand-harvested & energised", d: "Cleaned, sun-dried, and blessed with Vedic rituals." },
              ].map((f) => (
                <li key={f.t} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-lg">{f.icon}</span>
                  <span>
                    <span className="block font-semibold text-brand-800">{f.t}</span>
                    <span className="block text-sm text-brand-600">{f.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-6 inline-block font-semibold text-brand-600 hover:text-brand-800"
            >
              Learn more about our farm →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-900">Featured Beads</h2>
            <p className="mt-1 text-brand-600">Hand-picked, most-loved rudraksha for you.</p>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-brand-600 hover:text-brand-800 sm:block">
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-brand-600">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Mukhi explorer */}
      <section className="bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-2 font-serif text-3xl font-bold text-brand-900">Find Your Mukhi</h2>
          <p className="mb-8 text-brand-600">Each face (mukhi) carries a unique blessing. Explore by number.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7">
            {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`/products?search=${n}%20mukhi`}
                className="grid place-items-center rounded-xl border border-brand-200 bg-white py-5 font-serif text-xl font-bold text-brand-800 transition hover:border-brand-500 hover:bg-brand-100"
              >
                {n}
                <span className="text-xs font-normal text-brand-400">Mukhi</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
