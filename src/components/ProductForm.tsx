import Link from "next/link";
import { getOrigins } from "@/lib/queries";
import { MultiImageField } from "@/components/MultiImageField";

type ProductDefaults = {
  name?: string;
  slug?: string;
  mukhi?: number;
  origin?: string;
  shortDesc?: string;
  description?: string;
  benefits?: string;
  rulingPlanet?: string | null;
  deity?: string | null;
  mantra?: string | null;
  priceInr?: number;
  compareAtInr?: number | null;
  stock?: number;
  image?: string | null;
  images?: string[];
  featured?: boolean;
  active?: boolean;
};

const inputCls =
  "w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500";

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  product?: ProductDefaults;
  submitLabel: string;
}) {
  const p = product ?? {};
  const origins = getOrigins();

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Basic info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input name="name" required defaultValue={p.name} className={inputCls} placeholder="5 Mukhi Rudraksha" />
          </Field>
          <Field label="Slug (auto from name if blank)">
            <input name="slug" defaultValue={p.slug} className={inputCls} placeholder="5-mukhi-rudraksha" />
          </Field>
          <Field label="Mukhi (faces, 0 for special)">
            <input name="mukhi" type="number" defaultValue={p.mukhi ?? 0} className={inputCls} />
          </Field>
          <Field label="Origin">
            <select name="origin" defaultValue={p.origin ?? "Mangalore, Karnataka"} className={inputCls}>
              {origins.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Short description">
              <input name="shortDesc" defaultValue={p.shortDesc} className={inputCls} placeholder="One-line summary shown on cards" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Full description">
              <textarea name="description" rows={4} defaultValue={p.description} className={inputCls} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Benefits (one per line)">
              <textarea name="benefits" rows={4} defaultValue={p.benefits} className={inputCls} placeholder={"Promotes calmness\nSupports health"} />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Spiritual details</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ruling planet">
            <input name="rulingPlanet" defaultValue={p.rulingPlanet ?? ""} className={inputCls} />
          </Field>
          <Field label="Deity">
            <input name="deity" defaultValue={p.deity ?? ""} className={inputCls} />
          </Field>
          <Field label="Mantra">
            <input name="mantra" defaultValue={p.mantra ?? ""} className={inputCls} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Pricing &amp; inventory</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (INR) *">
            <input name="priceInr" type="number" required defaultValue={p.priceInr} className={inputCls} />
          </Field>
          <Field label="Compare-at price (INR)">
            <input name="compareAtInr" type="number" defaultValue={p.compareAtInr ?? ""} className={inputCls} />
          </Field>
          <Field label="Stock">
            <input name="stock" type="number" defaultValue={p.stock ?? 10} className={inputCls} />
          </Field>
          <div className="sm:col-span-3">
            <Field label="Product images (optional — auto-generated if none). First/starred is the default.">
              <MultiImageField images={p.images} defaultImage={p.image} />
            </Field>
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <input type="checkbox" name="featured" defaultChecked={p.featured ?? false} className="h-4 w-4" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <input type="checkbox" name="active" defaultChecked={p.active ?? true} className="h-4 w-4" />
            Active (visible in store)
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          {submitLabel}
        </button>
        <Link href="/admin/products" className="rounded-xl border border-brand-300 px-6 py-3 font-semibold text-brand-700 hover:border-brand-500">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-brand-700">{label}</span>
      {children}
    </label>
  );
}
