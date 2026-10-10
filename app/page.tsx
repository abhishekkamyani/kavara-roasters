import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { TierBadge } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import { CHECKOUT_MOQ_KG, TIERS } from "@/lib/constants";
import { discountPercent } from "@/lib/pricing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Structured data so search engines can identify the business and the site.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

const steps = [
  {
    title: "Sign in to your account",
    body: "We set up each partner café with an account and a tier. There's no public sign-up, so wholesale prices stay between us.",
  },
  {
    title: "Build your order",
    body: `Browse the catalog at your tier's price and add coffee by the kilogram. Orders start at ${CHECKOUT_MOQ_KG}kg in total, mixed however you like.`,
  },
  {
    title: "We roast, invoice and ship",
    body: "Your order is roasted for you, then invoiced and shipped. Follow its status and look up past invoices from your account at any time.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand />
        <Button asChild variant="ghost">
          <Link href="/login">Sign in</Link>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-14 px-4 py-16 sm:px-6">
        <section className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.28em] text-gold-ink uppercase">
            Wholesale portal
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-6xl">
            Small-lot coffee, roasted to order for your café.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Sign in to browse the wholesale catalog at your tier&apos;s pricing,
            place orders and keep track of your invoices.
          </p>
          <Button asChild size="lg" className="mt-8 h-11 px-5 text-base">
            <Link href="/login">
              Enter the portal
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </section>

        <section aria-labelledby="tiers-heading">
          <h2 id="tiers-heading" className="sr-only">
            Wholesale pricing tiers
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {TIERS.map((tier) => {
              const percent = discountPercent(tier);
              return (
                <li key={tier} className="rounded-xl border bg-muted/40 p-5">
                  <TierBadge tier={tier} />
                  <p className="mt-4 font-heading text-2xl">
                    {percent === 0 ? "Base price" : `${percent}% off`}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {percent === 0
                      ? "Standard wholesale pricing on every coffee."
                      : "Applied automatically to every coffee in the catalog."}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Every order ships from {CHECKOUT_MOQ_KG}kg.
          </p>
        </section>

        <section aria-labelledby="how-heading">
          <h2
            id="how-heading"
            className="font-heading text-2xl font-medium tracking-tight sm:text-3xl"
          >
            How wholesale ordering works
          </h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="text-sm font-medium text-gold-ink tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}
