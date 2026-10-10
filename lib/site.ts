/**
 * Public origin of the deployed site, used for canonical URLs, the sitemap
 * and social previews. Set NEXT_PUBLIC_SITE_URL in production; on Vercel the
 * production domain is picked up automatically.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const SITE_NAME = "Kavara Roasters";

export const SITE_TITLE = "Kavara Roasters — Wholesale Coffee for Cafés";

export const SITE_DESCRIPTION =
  "Small-lot, roasted-to-order wholesale coffee for cafés. Partner cafés sign in for tier pricing of up to 15% off, order from 5kg, and track every invoice.";
