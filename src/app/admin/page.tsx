import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { formatDate, orderStatusColor } from "@/lib/utils";

const PAID_STATUSES = ["PAID", "SHIPPED", "DELIVERED"];
const CHART_DAYS = 14;

export default async function AdminDashboard() {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (CHART_DAYS - 1));

  const [productCount, orderCount, paidAgg, lowStock, recentOrders, revenueOrders, topItems] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalInr: true },
        _count: true,
        where: { status: { in: PAID_STATUSES } },
      }),
      prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 6 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.findMany({
        where: { status: { in: PAID_STATUSES }, createdAt: { gte: since } },
        select: { createdAt: true, totalInr: true },
      }),
      prisma.orderItem.groupBy({
        by: ["name"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const revenue = paidAgg._sum.totalInr ?? 0;
  const paidOrderCount = paidAgg._count ?? 0;
  const aov = paidOrderCount > 0 ? Math.round(revenue / paidOrderCount) : 0;

  // Bucket paid revenue into one column per day for the last CHART_DAYS days.
  const days: { label: string; total: number }[] = Array.from({ length: CHART_DAYS }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return { label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), total: 0 };
  });
  for (const o of revenueOrders) {
    const idx = Math.floor((new Date(o.createdAt).getTime() - since.getTime()) / 86_400_000);
    if (idx >= 0 && idx < CHART_DAYS) days[idx].total += o.totalInr;
  }
  const maxDay = Math.max(1, ...days.map((d) => d.total));
  const maxUnits = Math.max(1, ...topItems.map((t) => t._sum.quantity ?? 0));

  const stats = [
    { label: "Products", value: String(productCount) },
    { label: "Orders", value: String(orderCount) },
    { label: "Revenue (paid)", value: formatMoney(revenue, "INR") },
    { label: "Avg order value", value: formatMoney(aov, "INR") },
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

      {/* Revenue chart + top sellers */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-100 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-brand-800">
              Paid revenue · last {CHART_DAYS} days
            </h2>
            <span className="text-sm font-medium text-brand-600">
              {formatMoney(days.reduce((s, d) => s + d.total, 0), "INR")}
            </span>
          </div>
          <div className="flex h-40 items-end gap-1.5">
            {days.map((d, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-brand-500/80 transition-all group-hover:bg-brand-600"
                  style={{ height: `${(d.total / maxDay) * 100}%` }}
                  title={`${d.label}: ${formatMoney(d.total, "INR")}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-brand-400">
            <span>{days[0]?.label}</span>
            <span>{days[Math.floor(CHART_DAYS / 2)]?.label}</span>
            <span>{days[CHART_DAYS - 1]?.label}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-100 bg-white p-5">
          <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Top sellers</h2>
          {topItems.length === 0 ? (
            <p className="text-sm text-brand-500">No sales yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {topItems.map((t) => {
                const units = t._sum.quantity ?? 0;
                return (
                  <li key={t.name}>
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-2 text-brand-700">{t.name}</span>
                      <span className="shrink-0 font-semibold text-brand-800">{units} sold</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${(units / maxUnits) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
