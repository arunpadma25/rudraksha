export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 h-9 w-64 animate-pulse rounded-lg bg-brand-100" />
      <div className="mb-8 h-24 w-full animate-pulse rounded-2xl bg-brand-100" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
            <div className="aspect-square w-full animate-pulse bg-brand-100" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-brand-100" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-brand-100" />
              <div className="h-9 w-full animate-pulse rounded bg-brand-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
