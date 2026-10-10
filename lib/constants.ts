export const ROLES = ["ADMIN", "CLIENT"] as const;
export type Role = (typeof ROLES)[number];

export const TIERS = ["BRONZE", "SILVER", "GOLD"] as const;
export type Tier = (typeof TIERS)[number];

export const ORDER_STATUSES = ["PENDING", "INVOICED", "SHIPPED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ROAST_LEVELS = ["Light", "Medium", "Medium-Dark", "Dark"] as const;
export type RoastLevel = (typeof ROAST_LEVELS)[number];

/** Fraction taken off the base price for each wholesale tier. */
export const TIER_DISCOUNT: Record<Tier, number> = {
  BRONZE: 0,
  SILVER: 0.1,
  GOLD: 0.15,
};

export const MIN_PASSWORD_LENGTH = 8;

/** Minimum total weight a single checkout must reach. */
export const CHECKOUT_MOQ_KG = 5;

/** Hosts UploadThing serves files from; product images must live on one of them. */
export const UPLOADTHING_HOST_PATTERN = /(^|\.)(utfs\.io|ufs\.sh)$/;
