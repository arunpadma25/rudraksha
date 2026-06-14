"use client";

import { useMemo, useRef, useState } from "react";
import {
  resizeImageFile,
  getCroppedBlob,
  uploadBlob,
  type CropArea,
} from "@/lib/image-client";
import { ImageCropperModal } from "@/components/ImageCropperModal";

export function MultiImageField({
  images: initialImages = [],
  defaultImage,
}: {
  images?: string[];
  defaultImage?: string | null;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [defaultUrl, setDefaultUrl] = useState<string>(defaultImage ?? initialImages[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<{ index: number; src: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveDefault = useMemo(
    () => (defaultUrl && images.includes(defaultUrl) ? defaultUrl : images[0] ?? ""),
    [defaultUrl, images]
  );

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const blob = await resizeImageFile(file);
        const url = await uploadBlob(blob, file.name.replace(/\.[^.]+$/, "") + ".jpg");
        uploaded.push(url);
      }
      setImages((prev) => {
        const next = [...prev, ...uploaded];
        setDefaultUrl((d) => d || next[0] || "");
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(url: string) {
    setImages((prev) => {
      const next = prev.filter((u) => u !== url);
      if (defaultUrl === url) setDefaultUrl(next[0] ?? "");
      return next;
    });
  }

  function move(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function applyCrop(area: CropArea) {
    if (!cropTarget) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await getCroppedBlob(cropTarget.src, area);
      const url = await uploadBlob(blob, `cropped-${Date.now()}.jpg`);
      setImages((prev) => prev.map((u, i) => (i === cropTarget.index ? url : u)));
      setDefaultUrl((d) => (d === cropTarget.src ? url : d));
      setCropTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Submitted values */}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      <input type="hidden" name="defaultImage" value={effectiveDefault} />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? "Working…" : "+ Upload Images"}
        </button>
        <span className="text-xs text-brand-400">
          You can select multiple. Auto-resized to max 1400px. JPG/PNG/WEBP/GIF/AVIF · 5 MB each.
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          multiple
          onChange={onFilesSelected}
          className="hidden"
        />
      </div>

      {error && <p className="mb-2 text-xs font-medium text-red-600">{error}</p>}

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50 p-6 text-center text-sm text-brand-400">
          No images yet. A bead image will be auto-generated until you add photos.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, index) => {
            const isDefault = url === effectiveDefault;
            return (
              <div
                key={url}
                className={`group relative overflow-hidden rounded-xl border bg-white ${
                  isDefault ? "border-brand-500 ring-2 ring-brand-200" : "border-brand-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Product image ${index + 1}`} className="aspect-square w-full object-cover" />

                {isDefault && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Default
                  </span>
                )}

                <div className="flex items-center justify-between gap-1 p-1.5">
                  <div className="flex gap-1">
                    <IconBtn title="Move left" onClick={() => move(index, -1)} disabled={index === 0}>←</IconBtn>
                    <IconBtn title="Move right" onClick={() => move(index, 1)} disabled={index === images.length - 1}>→</IconBtn>
                  </div>
                  <div className="flex gap-1">
                    {!isDefault && (
                      <IconBtn title="Set as default" onClick={() => setDefaultUrl(url)}>★</IconBtn>
                    )}
                    <IconBtn title="Crop" onClick={() => setCropTarget({ index, src: url })}>✂</IconBtn>
                    <IconBtn title="Remove" onClick={() => remove(url)} danger>✕</IconBtn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cropTarget && (
        <ImageCropperModal
          src={cropTarget.src}
          busy={busy}
          onCancel={() => setCropTarget(null)}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-7 w-7 place-items-center rounded-md border text-xs transition disabled:opacity-30 ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-brand-200 text-brand-700 hover:bg-brand-50"
      }`}
    >
      {children}
    </button>
  );
}
