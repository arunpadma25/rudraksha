"use client";

import { useToast, type ToastType } from "@/store/toast";

const styles: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "bg-emerald-600", icon: "✓" },
  error: { bg: "bg-red-600", icon: "!" },
  info: { bg: "bg-brand-700", icon: "i" },
};

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const removeToast = useToast((s) => s.removeToast);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-4">
      {toasts.map((t) => {
        const s = styles[t.type];
        return (
          <button
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl ${s.bg} px-4 py-3 text-left text-white shadow-lg`}
            style={{ animation: "toastIn 0.25s ease both" }}
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20 text-sm font-bold">
              {s.icon}
            </span>
            <span className="flex-1 text-sm font-medium">{t.message}</span>
            <span className="text-white/70" aria-hidden>×</span>
          </button>
        );
      })}
    </div>
  );
}
