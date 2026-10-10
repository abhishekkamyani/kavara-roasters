import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { TierBadge } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import { CHECKOUT_MOQ_KG, TIERS } from "@/lib/constants";
import { discountPercent } from "@/lib/pricing";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
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
            Partner tiers
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
      </main>
    </div>
  );
}
