import { calculatePriceWithDiscount } from './pgUtils';

export interface PricingBreakdown {
  baseTotal: number;
  discountPercent: number;
  savings: number;
  finalPrice: number;
}

/**
 * Calculate booking price with monthly discount tiers.
 * Mirrors the legacy sidebar + booking logic exactly.
 */
export const calculateBookingPrice = (
  basePrice: number,
  months: number
): PricingBreakdown => {
  const baseTotal = basePrice * months;

  // Legacy discount tiers (must match original PGDetail.tsx behavior)
  let discountPercent = 0;
  if (months >= 6) {
    discountPercent = 15;
  } else if (months >= 3) {
    discountPercent = 10;
  }

  const savings = Math.round((baseTotal * discountPercent) / 100);
  const finalPrice = baseTotal - savings;

  return {
    baseTotal,
    discountPercent,
    savings,
    finalPrice: Math.round(finalPrice),
  };
};

/**
 * Wrapper around the shared utility for cases that need the 12-month tier.
 */
export const calculatePriceWithLongTermDiscount = (
  basePrice: number,
  months: number
): PricingBreakdown => {
  const result = calculatePriceWithDiscount(basePrice, months);
  return {
    baseTotal: basePrice * months,
    discountPercent: result.discount,
    savings: result.savings,
    finalPrice: result.finalPrice,
  };
};

