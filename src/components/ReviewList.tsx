import { Stars } from "@/components/Stars";
import { formatDate } from "@/lib/utils";

type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-brand-200 bg-white p-6 text-center text-sm text-brand-500">
        No reviews yet. Be the first to share your experience.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-2xl border border-brand-100 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700">
                {r.authorName.charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="text-sm font-semibold text-brand-800">{r.authorName}</div>
                <Stars rating={r.rating} />
              </div>
            </div>
            <span className="text-xs text-brand-400">{formatDate(r.createdAt)}</span>
          </div>
          <p className="mt-3 text-brand-700">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}
