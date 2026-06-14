"use client";

import { useActionState, useState } from "react";
import { createReview, type ReviewState } from "@/app/products/actions";

export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const action = createReview.bind(null, productId, slug);
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(action, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <form action={formAction} className="rounded-2xl border border-brand-100 bg-white p-5">
      <h3 className="font-serif text-lg font-bold text-brand-800">Write a review</h3>

      <input type="hidden" name="rating" value={rating} />
      <div className="mt-3 flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-checked={rating === n}
            role="radio"
            className={`text-2xl leading-none transition ${
              (hover || rating) >= n ? "text-amber-500" : "text-brand-200"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={3}
        placeholder="Share your experience with this rudraksha…"
        className="mt-3 w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
      />

      {state.error && <p className="mt-2 text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Submit Review"}
      </button>
    </form>
  );
}
