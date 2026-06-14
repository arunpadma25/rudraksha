"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { CropArea } from "@/lib/image-client";

export function ImageCropperModal({
  src,
  onCancel,
  onApply,
  busy = false,
}: {
  src: string;
  onCancel: () => void;
  onApply: (area: CropArea) => void;
  busy?: boolean;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<CropArea | null>(null);

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setAreaPixels(pixels);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-brand-100 px-5 py-3">
          <h3 className="font-serif text-lg font-bold text-brand-900">Crop image</h3>
          <p className="text-xs text-brand-500">Drag to reposition, use the slider to zoom. Square 1:1.</p>
        </div>

        <div className="relative h-80 w-full bg-brand-900">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-3">
          <span className="text-xs font-medium text-brand-600">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-brand-600"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-brand-100 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 hover:border-brand-400 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => areaPixels && onApply(areaPixels)}
            disabled={busy || !areaPixels}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {busy ? "Applying…" : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
