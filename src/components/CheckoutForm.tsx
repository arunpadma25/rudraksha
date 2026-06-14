"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/store/currency";
import { formatMoney } from "@/lib/currency";
import { computeShippingInr } from "@/lib/shipping";
import { productImageUrl } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";
import { COUNTRIES } from "@/lib/countries";
import type { SavedAddress } from "@/components/AddressBook";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm({
  defaultName,
  defaultEmail,
  savedAddresses = [],
}: {
  defaultName?: string;
  defaultEmail?: string;
  savedAddresses?: SavedAddress[];
}) {
  const router = useRouter();
  const { items, subtotalInr, clear } = useCart();
  const currency = useCurrency((s) => s.currency);
  const mounted = useHydrated();

  const defaultAddress = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress?.id ?? "new"
  );
  const [form, setForm] = useState({
    fullName: defaultAddress?.fullName ?? defaultName ?? "",
    email: defaultEmail ?? "",
    phone: defaultAddress?.phone ?? "",
    line1: defaultAddress?.line1 ?? "",
    line2: defaultAddress?.line2 ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    postalCode: defaultAddress?.postalCode ?? "",
    country: defaultAddress?.country ?? "IN",
  });
  const [saveAddress, setSaveAddress] = useState(savedAddresses.length === 0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function selectSavedAddress(id: string) {
    setSelectedAddressId(id);
    if (id === "new") {
      setForm((f) => ({
        ...f,
        fullName: defaultName ?? "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "IN",
      }));
      setSaveAddress(true);
      return;
    }
    const addr = savedAddresses.find((a) => a.id === id);
    if (addr) {
      setForm((f) => ({
        ...f,
        fullName: addr.fullName,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2 ?? "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      }));
      setSaveAddress(false);
    }
  }

  const code = mounted ? currency : "INR";
  const subtotal = subtotalInr();
  const shipping = useMemo(() => computeShippingInr(subtotal, form.country), [subtotal, form.country]);
  const total = subtotal + shipping;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function finalize(orderId: string) {
    clear();
    router.push(`/order/${orderId}`);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          currency,
          paymentMethod,
          saveAddress,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/checkout");
          return;
        }
        setError(data.error || "Checkout failed.");
        setLoading(false);
        return;
      }

      if (data.mode === "COD" || data.mode === "MOCK") {
        await finalize(data.orderId);
        return;
      }

      if (data.mode === "RAZORPAY") {
        const ok = await loadRazorpayScript();
        if (!ok || !window.Razorpay) {
          setError("Could not load the payment widget. Please try Cash on Delivery.");
          setLoading(false);
          return;
        }
        const rzp = new window.Razorpay({
          key: data.razorpay.keyId,
          amount: data.razorpay.amount,
          currency: data.razorpay.currency,
          name: "Rudraksha Sacred Store",
          description: "Order payment",
          order_id: data.razorpay.orderId,
          prefill: { name: form.fullName, email: form.email, contact: form.phone },
          theme: { color: "#a9521f" },
          handler: async (response: RazorpayResponse) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId, ...response }),
            });
            if (verifyRes.ok) {
              await finalize(data.orderId);
            } else {
              setError("Payment could not be verified. Please contact support.");
              setLoading(false);
            }
          },
        });
        rzp.open();
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-900">Nothing to check out</h1>
        <p className="mt-2 text-brand-600">Add some beads to your cart first.</p>
        <Link href="/products" className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-5">
      {/* Left: details */}
      <div className="space-y-6 lg:col-span-3">
        <h1 className="font-serif text-3xl font-bold text-brand-900">Checkout</h1>

        {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputCls} /></Field>
            <Field label="Phone"><input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} /></Field>
            <div className="sm:col-span-2">
              <Field label="Email"><input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} /></Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Shipping address</h2>

          {savedAddresses.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 text-sm font-medium text-brand-700">Choose a saved address</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {savedAddresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => selectSavedAddress(a.id)}
                    className={`rounded-xl border p-3 text-left text-sm transition ${
                      selectedAddressId === a.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-brand-200 hover:border-brand-300"
                    }`}
                  >
                    <div className="font-semibold text-brand-800">
                      {a.fullName}
                      {a.isDefault && <span className="ml-2 text-xs font-normal text-brand-500">(Default)</span>}
                    </div>
                    <div className="text-brand-600">
                      {a.line1}, {a.city}, {a.state} {a.postalCode}
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => selectSavedAddress("new")}
                  className={`rounded-xl border p-3 text-left text-sm font-medium transition ${
                    selectedAddressId === "new"
                      ? "border-brand-500 bg-brand-50 text-brand-800"
                      : "border-dashed border-brand-300 text-brand-600 hover:border-brand-400"
                  }`}
                >
                  + Use a new address
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Address line 1"><input required value={form.line1} onChange={(e) => update("line1", e.target.value)} className={inputCls} /></Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address line 2 (optional)"><input value={form.line2} onChange={(e) => update("line2", e.target.value)} className={inputCls} /></Field>
            </div>
            <Field label="City"><input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} /></Field>
            <Field label="State / Province"><input required value={form.state} onChange={(e) => update("state", e.target.value)} className={inputCls} /></Field>
            <Field label="Postal code"><input required value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} className={inputCls} /></Field>
            <Field label="Country">
              <select value={form.country} onChange={(e) => update("country", e.target.value)} className={inputCls}>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </Field>
            {selectedAddressId === "new" && (
              <label className="flex items-center gap-2 text-sm font-medium text-brand-700 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="h-4 w-4"
                />
                Save this address to my account for next time
              </label>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-bold text-brand-800">Payment</h2>
          <div className="space-y-3">
            <PaymentOption
              selected={paymentMethod === "ONLINE"}
              onSelect={() => setPaymentMethod("ONLINE")}
              title="Pay Online (Card / UPI / Netbanking)"
              desc="Secure payment via Razorpay. Charged in INR."
            />
            <PaymentOption
              selected={paymentMethod === "COD"}
              onSelect={() => setPaymentMethod("COD")}
              title="Cash on Delivery"
              desc="Pay when your order is delivered (India only recommended)."
            />
          </div>
        </section>
      </div>

      {/* Right: summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-brand-100 bg-white p-6">
          <h2 className="font-serif text-xl font-bold text-brand-900">Your order</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={productImageUrl(item)} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-brand-800">{item.name}</div>
                  <div className="text-xs text-brand-500">Qty {item.quantity}</div>
                </div>
                <div className="text-sm font-semibold text-brand-800" suppressHydrationWarning>
                  {formatMoney(item.priceInr * item.quantity, code)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-brand-100 pt-4 text-sm">
            <Row label="Subtotal" value={formatMoney(subtotal, code)} />
            <Row label="Shipping" value={shipping === 0 ? "Free" : formatMoney(shipping, code)} />
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 text-lg font-bold text-brand-900">
            <span>Total</span>
            <span suppressHydrationWarning>{formatMoney(total, code)}</span>
          </div>
          {code !== "INR" && (
            <p className="mt-2 text-xs text-brand-400">
              Online payments are processed in INR ({formatMoney(total, "INR")}).
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Processing…" : paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </button>
          <p className="mt-3 text-center text-xs text-brand-400">
            By placing your order you agree to our demo terms.
          </p>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-brand-700">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-brand-600">
      <span>{label}</span>
      <span suppressHydrationWarning className="font-medium text-brand-800">{value}</span>
    </div>
  );
}

function PaymentOption({
  selected,
  onSelect,
  title,
  desc,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected ? "border-brand-500 bg-brand-50" : "border-brand-200 hover:border-brand-300"
      }`}
    >
      <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full border-2 ${selected ? "border-brand-600" : "border-brand-300"}`}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
      </span>
      <span>
        <span className="block font-medium text-brand-800">{title}</span>
        <span className="block text-sm text-brand-500">{desc}</span>
      </span>
    </button>
  );
}
