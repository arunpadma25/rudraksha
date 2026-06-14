import { prisma } from "@/lib/prisma";
import { formatMoney, isCurrencyCode } from "@/lib/currency";
import { formatDate, orderStatusColor } from "@/lib/utils";
import { setOrderStatus } from "@/app/admin/actions";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-brand-900">Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center text-brand-600">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cur = isCurrencyCode(order.currency) ? order.currency : "INR";
            return (
              <div key={order.id} className="rounded-2xl border border-brand-100 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-brand-800">Order #{order.id.slice(-8)}</div>
                    <div className="text-xs text-brand-500">{formatDate(order.createdAt)} · {order.paymentMethod}</div>
                    <div className="mt-1 text-sm text-brand-600">{order.fullName} · {order.email} · {order.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-900">{formatMoney(order.totalInr, "INR")}</div>
                    {cur !== "INR" && (
                      <div className="text-xs text-brand-400">Customer saw {formatMoney(order.totalInr, cur)}</div>
                    )}
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-t border-brand-50 pt-3 text-sm text-brand-600">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-brand-50 pt-3">
                  <div className="text-xs text-brand-500">
                    Ship to: {order.line1}, {order.city}, {order.state} {order.postalCode}, {order.country}
                  </div>
                  <form action={setOrderStatus.bind(null, order.id)} className="flex items-center gap-2">
                    <select
                      key={order.status}
                      name="status"
                      defaultValue={order.status}
                      className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700">
                      Update
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
