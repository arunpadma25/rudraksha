"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, forward this to your error tracker (e.g. Sentry).
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-3xl">
        ⚠️
      </div>
      <h1 className="font-serif text-2xl font-bold text-brand-900">Something went wrong</h1>
      <p className="mt-2 text-brand-600">
        We hit an unexpected error. Please try again — if it keeps happening, contact us.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-brand-300 px-6 py-3 font-semibold text-brand-700 hover:border-brand-500"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
