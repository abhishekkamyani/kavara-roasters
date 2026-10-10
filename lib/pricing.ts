import { CHECKOUT_MOQ_KG, TIER_DISCOUNT, type Tier } from "./constants";

export function roundMoney(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/** Per-kg price a client on `tier` pays for a product with `basePrice`. */
export function priceForTier(basePrice: number, tier: Tier) {
  return roundMoney(basePrice * (1 - TIER_DISCOUNT[tier]));
}

export function discountPercent(tier: Tier) {
  return Math.round(TIER_DISCOUNT[tier] * 100);
}

/** Kilograms still missing before a cart of `totalKg` can be checked out. */
export function kgShortOfMoq(totalKg: number) {
  return Math.max(0, CHECKOUT_MOQ_KG - totalKg);
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(amount: number) {
  return money.format(amount);
}

export function invoiceNumber(orderId: string) {
  return `KR-${orderId.slice(-6).toUpperCase()}`;
}
