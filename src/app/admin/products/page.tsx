import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { deleteProduct } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { mukhi: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-brand-900">Products</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-xs uppercase text-brand-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mukhi</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-brand-50/50">
                <td className="px-4 py-3 font-medium text-brand-800">{p.name}</td>
                <td className="px-4 py-3 text-brand-600">{p.mukhi > 0 ? p.mukhi : "—"}</td>
                <td className="px-4 py-3 text-brand-600">{formatMoney(p.priceInr, "INR")}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 5 ? "font-semibold text-amber-600" : "text-brand-600"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap gap-1">
                    {p.active ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">Hidden</span>
                    )}
                    {p.featured && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Featured</span>}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-400">
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <ConfirmSubmit
                        message={`Delete "${p.name}"? This cannot be undone.`}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
