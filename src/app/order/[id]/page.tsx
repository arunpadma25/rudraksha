import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatMoney, isCurrencyCode } from "@/lib/currency";
import { formatDate, orderStatusColor, productImageUrl } from "@/lib/utils";

export const metadata = { title: "Order Confirmation" };

type Params = Promise<{ id: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect(`/login?redirect=/order/${id}`);

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  // Only the order's owner or an admin may view it.
  if (order.userId !== user.id && user.role !== "ADMIN") notFound();

  const cur = isCurrencyCode(order.currency) ? order.currency : "INR";
  const paid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-brand-100 bg-white p-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-900">Thank you for your order!</h1>
        <p className="mt-2 text-brand-600">
          {paid
            ? "Your payment was successful and your order is confirmed."
            : "Your order has been placed. Pay on delivery."}
        </p>
        <p className="mt-1 text-sm text-brand-400">Order ID: {order.id}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-brand-500">Placed on {formatDate(order.createdAt)}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImageUrl({ image: null, mukhi: item.mukhi, name: item.name })}
                alt={item.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-brand-800">{item.name}</div>
                <div className="text-xs text-brand-500">Qty {item.quantity}</div>
              </div>
              <div className="text-sm font-semibold text-brand-800">
                {formatMoney(item.priceInr * item.quantity, cur)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-brand-100 pt-4 text-sm">
          <div className="flex justify-between text-brand-600">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotalInr, cur)}</span>
          </div>
          <div className="flex justify-between text-brand-600">
            <span>Shipping</span>
            <span>{order.shippingInr === 0 ? "Free" : formatMoney(order.shippingInr, cur)}</span>
          </div>
          <div className="flex justify-between border-t border-brand-100 pt-2 text-base font-bold text-brand-900">
            <span>Total</span>
            <span>{formatMoney(order.totalInr, cur)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-brand-100 pt-4 text-sm sm:grid-cols-2">
          <div>
            <div className="font-semibold text-brand-800">Shipping to</div>
            <div className="text-brand-600">
              {order.fullName}<br />
              {order.line1}{order.line2 ? `, ${order.line2}` : ""}<br />
              {order.city}, {order.state} {order.postalCode}<br />
              {order.country}<br />
              {order.phone}
            </div>
          </div>
          <div>
            <div className="font-semibold text-brand-800">Payment</div>
            <div className="text-brand-600">
              Method: {order.paymentMethod}<br />
              Status: {order.status}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/products" className="rounded-xl border border-brand-300 px-6 py-3 font-semibold text-brand-700 hover:border-brand-500">
          Continue Shopping
        </Link>
        <Link href="/account" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          View My Orders
        </Link>
      </div>
    </div>
  );
}
