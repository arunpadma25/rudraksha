"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="self-start">
      <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt={name} className="aspect-square w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border transition ${
                i === active ? "border-brand-500 ring-2 ring-brand-200" : "border-brand-200 hover:border-brand-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${name} ${i + 1}`} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
