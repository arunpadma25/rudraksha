import Link from "next/link";
import { getProducts, getOrigins, getMukhiOptions, type ProductFilters } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Shop Rudraksha Beads" };

type SearchParams = Promise<{
  search?: string;
  origin?: string;
  featured?: string;
  sort?: string;
  mukhi?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

function parsePositiveInt(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const filters: ProductFilters = {
    search: sp.search?.trim() || undefined,
    origin: sp.origin || undefined,
    featured: sp.featured === "1",
    mukhi: parsePositiveInt(sp.mukhi),
    minPriceInr: parsePositiveInt(sp.minPrice),
    maxPriceInr: parsePositiveInt(sp.maxPrice),
    sort: (["newest", "price-asc", "price-desc", "mukhi-asc"].includes(sp.sort ?? "")
      ? sp.sort
      : "newest") as ProductFilters["sort"],
  };

  const [products, mukhiOptions] = await Promise.all([getProducts(filters), getMukhiOptions()]);
  const origins = getOrigins();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-900">
          {filters.featured ? "Featured Rudraksha" : "All Rudraksha Beads"}
        </h1>
        <p className="mt-1 text-brand-600">{products.length} products available</p>
      </header>

      {/* Filter bar */}
      <form
        method="GET"
        className="mb-8 grid gap-3 rounded-2xl border border-brand-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase text-brand-500">Search</label>
          <input
            type="text"
            name="search"
            defaultValue={sp.search ?? ""}
            placeholder="e.g. 5 mukhi, Ganesh"
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase text-brand-500">Origin</label>
          <select
            name="origin"
            defaultValue={sp.origin ?? ""}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="">All origins</option>
            {origins.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase text-brand-500">Mukhi</label>
          <select
            name="mukhi"
            defaultValue={sp.mukhi ?? ""}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Any mukhi</option>
            {mukhiOptions.map((m) => (
              <option key={m} value={m}>
                {m > 0 ? `${m} Mukhi` : "Special / Combination"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase text-brand-500">Price (₹)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              min={0}
              inputMode="numeric"
              defaultValue={sp.minPrice ?? ""}
              placeholder="Min"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <span className="text-brand-400">–</span>
            <input
              type="number"
              name="maxPrice"
              min={0}
              inputMode="numeric"
              defaultValue={sp.maxPrice ?? ""}
              placeholder="Max"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold uppercase text-brand-500">Sort by</label>
          <select
            name="sort"
            defaultValue={sp.sort ?? "newest"}
            className="rounded-lg border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="mukhi-asc">Mukhi: Low to High</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          {filters.featured && <input type="hidden" name="featured" value="1" />}
          <button
            type="submit"
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Apply
          </button>
          <Link
            href="/products"
            className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:border-brand-400"
          >
            Reset
          </Link>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center text-brand-600">
          No products match your filters. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
