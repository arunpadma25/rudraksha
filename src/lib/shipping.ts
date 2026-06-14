// Simple, transparent shipping rules (amounts in INR).
// Domestic (India): free over a threshold, otherwise a flat fee.
// International: flat fee.

const FREE_DOMESTIC_THRESHOLD_INR = 2500;
const DOMESTIC_FEE_INR = 60;
const INTERNATIONAL_FEE_INR = 1500;

export function computeShippingInr(subtotalInr: number, country: string): number {
  if (subtotalInr <= 0) return 0;
  const isIndia = country.toUpperCase() === "IN" || country.toLowerCase() === "india";
  if (isIndia) {
    return subtotalInr >= FREE_DOMESTIC_THRESHOLD_INR ? 0 : DOMESTIC_FEE_INR;
  }
  return INTERNATIONAL_FEE_INR;
}

export const SHIPPING_INFO = {
  freeDomesticThresholdInr: FREE_DOMESTIC_THRESHOLD_INR,
  domesticFeeInr: DOMESTIC_FEE_INR,
  internationalFeeInr: INTERNATIONAL_FEE_INR,
};
