// Multi-currency support.
//
// All product prices are stored in INR. We convert to the customer's chosen
// currency using a static rate table (no paid FX API needed). Update RATES
// periodically, or later swap in a live FX feed without touching the UI.

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "AUD" | "CAD" | "SGD";

type CurrencyInfo = {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
  /** 1 INR = rate units of this currency. */
  rate: number;
  flag: string;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: "INR", label: "Indian Rupee", symbol: "\u20B9", locale: "en-IN", rate: 1, flag: "\uD83C\uDDEE\uD83C\uDDF3" },
  USD: { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US", rate: 0.012, flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  EUR: { code: "EUR", label: "Euro", symbol: "\u20AC", locale: "en-IE", rate: 0.011, flag: "\uD83C\uDDEA\uD83C\uDDFA" },
  GBP: { code: "GBP", label: "British Pound", symbol: "\u00A3", locale: "en-GB", rate: 0.0095, flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  AED: { code: "AED", label: "UAE Dirham", symbol: "\u062F.\u0625", locale: "en-AE", rate: 0.044, flag: "\uD83C\uDDE6\uD83C\uDDEA" },
  AUD: { code: "AUD", label: "Australian Dollar", symbol: "A$", locale: "en-AU", rate: 0.018, flag: "\uD83C\uDDE6\uD83C\uDDFA" },
  CAD: { code: "CAD", label: "Canadian Dollar", symbol: "C$", locale: "en-CA", rate: 0.016, flag: "\uD83C\uDDE8\uD83C\uDDE6" },
  SGD: { code: "SGD", label: "Singapore Dollar", symbol: "S$", locale: "en-SG", rate: 0.016, flag: "\uD83C\uDDF8\uD83C\uDDEC" },
};

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}

export function getRate(currency: CurrencyCode): number {
  return CURRENCIES[currency]?.rate ?? 1;
}

export function convertFromInr(amountInr: number, currency: CurrencyCode): number {
  return amountInr * getRate(currency);
}

export function formatMoney(amountInr: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency] ?? CURRENCIES.INR;
  const value = convertFromInr(amountInr, info.code);
  // INR shows whole rupees; other currencies show 2 decimals.
  const fractionDigits = info.code === "INR" ? 0 : 2;
  try {
    return new Intl.NumberFormat(info.locale, {
      style: "currency",
      currency: info.code,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return `${info.symbol}${value.toFixed(fractionDigits)}`;
  }
}
