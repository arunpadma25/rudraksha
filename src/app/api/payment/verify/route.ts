import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const schema = z.object({
  orderId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// Constant-time comparison to avoid leaking signature bytes via timing.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  // Only the authenticated buyer may confirm their own order.
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // The order must belong to the caller, be a Razorpay order, and the signed
  // gateway order id must match the one we created for THIS order at checkout.
  // This binds the (amount-bearing) Razorpay order to our local order and
  // prevents reusing a valid signature from a different/cheaper payment.
  if (order.userId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.paymentMethod !== "RAZORPAY" || order.paymentId !== razorpay_order_id) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!safeEqual(expected, razorpay_signature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  if (order.status !== "PAID") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID", paymentId: razorpay_payment_id },
      }),
      ...order.items
        .filter((i) => i.productId)
        .map((i) =>
          prisma.product.update({
            where: { id: i.productId! },
            data: { stock: { decrement: i.quantity } },
          })
        ),
    ]);
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}
