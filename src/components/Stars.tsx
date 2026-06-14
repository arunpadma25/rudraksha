import { cn } from "@/lib/utils";

/** Read-only star rating display. */
export function Stars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const rounded = Math.round(rating);
  const starSize = size === "md" ? "text-lg" : "text-sm";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("leading-none text-amber-500", starSize)} aria-hidden>
        {"★★★★★".slice(0, rounded)}
        <span className="text-brand-200">{"★★★★★".slice(rounded)}</span>
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-brand-500">
          {count > 0 ? `${rating.toFixed(1)} (${count})` : "No reviews"}
        </span>
      )}
    </span>
  );
}
