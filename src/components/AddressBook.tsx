"use client";

import { useState } from "react";
import { createAddress, deleteAddress, setDefaultAddress } from "@/app/account/address-actions";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { COUNTRIES } from "@/lib/countries";

export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const inputCls =
  "w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500";

export function AddressBook({ addresses }: { addresses: SavedAddress[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-brand-900">Saved Addresses</h2>
        <button
          onClick={() => setAdding((a) => !a)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {adding ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {adding && (
        <form
          action={createAddress}
          className="mb-6 grid gap-4 rounded-2xl border border-brand-100 bg-white p-5 sm:grid-cols-2"
        >
          <Field label="Full name"><input name="fullName" required className={inputCls} /></Field>
          <Field label="Phone"><input name="phone" required className={inputCls} /></Field>
          <div className="sm:col-span-2">
            <Field label="Address line 1"><input name="line1" required className={inputCls} /></Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Address line 2 (optional)"><input name="line2" className={inputCls} /></Field>
          </div>
          <Field label="City"><input name="city" required className={inputCls} /></Field>
          <Field label="State / Province"><input name="state" required className={inputCls} /></Field>
          <Field label="Postal code"><input name="postalCode" required className={inputCls} /></Field>
          <Field label="Country">
            <select name="country" defaultValue="IN" className={inputCls}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium text-brand-700 sm:col-span-2">
            <input type="checkbox" name="isDefault" className="h-4 w-4" />
            Set as default address
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Save Address
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center text-brand-500">
          No saved addresses yet. Add one to check out faster next time.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border bg-white p-5 ${a.isDefault ? "border-brand-500 ring-1 ring-brand-200" : "border-brand-100"}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-brand-800">{a.fullName}</span>
                {a.isDefault && (
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">Default</span>
                )}
              </div>
              <p className="text-sm text-brand-600">
                {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                {a.city}, {a.state} {a.postalCode}<br />
                {a.country}<br />
                📞 {a.phone}
              </p>
              <div className="mt-4 flex gap-2">
                {!a.isDefault && (
                  <form action={setDefaultAddress.bind(null, a.id)}>
                    <button className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-400">
                      Set default
                    </button>
                  </form>
                )}
                <form action={deleteAddress.bind(null, a.id)}>
                  <ConfirmSubmit
                    message="Delete this address?"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
