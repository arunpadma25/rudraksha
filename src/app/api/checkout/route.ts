import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { computeShippingInr } from "@/lib/shipping";
import { getRate, isCurrencyCode } from "@/lib/currency";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    line1: z.string().min(3),
    line2: z.string().optional().default(""),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(2),
    country: z.string().min(2),
  }),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1),
  currency: z.string().default("INR"),
  paymentMethod: z.enum(["COD", "ONLINE"]),
  saveAddress: z.boolean().optional().default(false),
});

function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`checkout:${getClientIp(req)}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  // Require an authenticated user to place an order.
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Please log in to place an order." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid checkout data" },
      { status: 400 }
    );
  }

  const { customer, items, paymentMethod } = parsed.data;
  const currency = isCurrencyCode(parsed.data.currency) ? parsed.data.currency : "INR";

  // Load products from DB (never trust client prices) and validate stock.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: { product: (typeof products)[number]; quantity: number }[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} of "${product.name}" left in stock` },
        { status: 400 }
      );
    }
    lineItems.push({ product, quantity: item.quantity });
  }

  const subtotalInr = lineItems.reduce((sum, li) => sum + li.product.priceInr * li.quantity, 0);
  const shippingInr = computeShippingInr(subtotalInr, customer.country);
  const totalInr = subtotalInr + shippingInr;
  const fxRate = getRate(currency);

  const baseOrderData = {
    userId: user.id,
    email: customer.email.toLowerCase(),
    fullName: customer.fullName,
    phone: customer.phone,
    currency,
    fxRate,
    subtotalInr,
    shippingInr,
    totalInr,
    line1: customer.line1,
    line2: customer.line2 || null,
    city: customer.city,
    state: customer.state,
    postalCode: customer.postalCode,
    country: customer.country,
    items: {
      create: lineItems.map((li) => ({
        productId: li.product.id,
        name: li.product.name,
        mukhi: li.product.mukhi,
        priceInr: li.product.priceInr,
        quantity: li.quantity,
      })),
    },
  };

  async function decrementStock() {
    await prisma.$transaction(
      lineItems.map((li) =>
        prisma.product.update({
          where: { id: li.product.id },
          data: { stock: { decrement: li.quantity } },
        })
      )
    );
  }

  // Optionally save this shipping address to the customer's account.
  if (parsed.data.saveAddress) {
    const existing = await prisma.address.count({ where: { userId: user.id } });
    await prisma.address.create({
      data: {
        userId: user.id,
        fullName: customer.fullName,
        phone: customer.phone,
        line1: customer.line1,
        line2: customer.line2 || null,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        country: customer.country,
        isDefault: existing === 0,
      },
    });
  }

  // Cash on delivery: place order immediately.
  if (paymentMethod === "COD") {
    const order = await prisma.order.create({
      data: { ...baseOrderData, status: "PENDING", paymentMethod: "COD" },
    });
    await decrementStock();
    return NextResponse.json({ ok: true, orderId: order.id, mode: "COD" });
  }

  // Online payment without configured keys -> built-in mock (instant success).
  if (!razorpayConfigured()) {
    const order = await prisma.order.create({
      data: {
        ...baseOrderData,
        status: "PAID",
        paymentMethod: "MOCK",
        paymentId: `mock_${Date.now()}`,
      },
    });
    await decrementStock();
    return NextResponse.json({ ok: true, orderId: order.id, mode: "MOCK" });
  }

  // Real Razorpay: create gateway order + pending local order.
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const rzpOrder = await razorpay.orders.create({
      amount: totalInr * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await prisma.order.create({
      data: {
        ...baseOrderData,
        status: "PENDING",
        paymentMethod: "RAZORPAY",
        paymentId: rzpOrder.id,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      mode: "RAZORPAY",
      razorpay: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
