import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { getUserAddresses } from "@/lib/queries";
import { formatMoney, isCurrencyCode } from "@/lib/currency";
import { formatDate, orderStatusColor } from "@/lib/utils";
import { AddressBook } from "@/components/AddressBook";

export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?redirect=/account");

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    getUserAddresses(user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-brand-900">My Account</h1>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-6">
        <h2 className="font-serif text-lg font-bold text-brand-800">Profile</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div><span className="text-brand-500">Name: </span><span className="font-medium text-brand-800">{user.name}</span></div>
          <div><span className="text-brand-500">Email: </span><span className="font-medium text-brand-800">{user.email}</span></div>
          <div><span className="text-brand-500">Role: </span><span className="font-medium text-brand-800">{user.role}</span></div>
        </div>
      </div>

      <div className="mt-10">
        <AddressBook addresses={addresses} />
      </div>

      <h2 className="mb-4 mt-10 font-serif text-2xl font-bold text-brand-900">Order History</h2>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-12 text-center text-brand-600">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/products" className="font-semibold text-brand-700 hover:underline">Start shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cur = isCurrencyCode(order.currency) ? order.currency : "INR";
            return (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="block rounded-2xl border border-brand-100 bg-white p-5 transition hover:border-brand-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-brand-800">Order #{order.id.slice(-8)}</div>
                    <div className="text-xs text-brand-500">{formatDate(order.createdAt)} · {order.items.length} item(s)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-800">{formatMoney(order.totalInr, cur)}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 truncate text-sm text-brand-500">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
