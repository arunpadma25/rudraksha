import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-100 font-serif text-3xl font-bold text-brand-700">
        ॐ
      </div>
      <h1 className="font-serif text-3xl font-bold text-brand-900">Page not found</h1>
      <p className="mt-2 text-brand-600">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Go home
        </Link>
        <Link
          href="/products"
          className="rounded-xl border border-brand-300 px-6 py-3 font-semibold text-brand-700 hover:border-brand-500"
        >
          Browse beads
        </Link>
      </div>
    </div>
  );
}
