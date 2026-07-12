import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Rudraksha Sacred logo">
      <defs>
        <radialGradient id="rk-bead" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#c96a2b" />
          <stop offset="55%" stopColor="#7c3f1a" />
          <stop offset="100%" stopColor="#4a230d" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#rk-bead)" />
      <ellipse cx="17" cy="16" rx="7" ry="4.5" fill="rgba(255,255,255,0.22)" />
      {/* grooves */}
      {[10, 17, 24, 31, 38].map((x) => (
        <path
          key={x}
          d={`M ${x} ${24 - Math.sqrt(Math.max(0, 22 * 22 - (x - 24) * (x - 24)))} Q ${x + 1.6} 24 ${x} ${
            24 + Math.sqrt(Math.max(0, 22 * 22 - (x - 24) * (x - 24)))
          }`}
          stroke="rgba(40,18,6,0.5)"
          strokeWidth="1.4"
          fill="none"
        />
      ))}
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, serif"
        fontSize="16"
        fontWeight="700"
        fill="#fff7ed"
      >
        ॐ
      </text>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <LogoMark className="h-9 w-9 shrink-0 drop-shadow-sm" />
      <span className="truncate font-serif text-base font-bold text-brand-800 sm:text-xl">
        Rudraksha <span className="text-brand-500">Sacred</span>
      </span>
    </span>
  );
}
