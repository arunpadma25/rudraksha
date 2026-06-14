import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { formatDate, orderStatusColor } from "@/lib/utils";

export default async function AdminDashboard() {
  const [productCount, orderCount, paidAgg, lowStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalInr: true }, where: { status: "PAID" } }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 6 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenue = paidAgg._sum.totalInr ?? 0;

  const stats = [
    { label: "Products", value: String(productCount) },
    { label: "Orders", value: String(orderCount) },
    { label: "Revenue (paid)", value: formatMoney(revenue, "INR") },
    { label: "Low stock", value: String(lowStock.length) },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-brand-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-100 bg-white p-5">
            <div className="text-sm text-brand-500">{s.label}</div>
            <div className="mt-1 font-serif text-2xl font-bold text-brand-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-brand-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-brand-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between">
                  <span className="text-brand-700">#{o.id.slice(-8)} · {formatDate(o.createdAt)}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-brand-800">{formatMoney(o.totalInr, "INR")}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${orderStatusColor(o.status)}`}>{o.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-brand-800">Low Stock</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-brand-600 hover:underline">Manage</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-brand-500">All products well stocked.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <span className="text-brand-700">{p.name}</span>
                  <span className={`font-semibold ${p.stock <= 0 ? "text-red-600" : "text-amber-600"}`}>{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
