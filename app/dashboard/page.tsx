import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { TierBadge } from "@/components/tier-badge";
import { CHECKOUT_MOQ_KG } from "@/lib/constants";
import { requireClient } from "@/lib/dal";
import { getProducts } from "@/lib/data";
import { discountPercent } from "@/lib/pricing";

export const metadata: Metadata = { title: "Catalog" };

export default function DashboardPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        Wholesale catalog
      </h1>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog />
      </Suspense>
    </>
  );
}

async function Catalog() {
  const user = await requireClient();
  const products = await getProducts();
  const percent = discountPercent(user.tier);

  return (
    <>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-muted-foreground">
        <TierBadge tier={user.tier} />
        <span>
          {percent === 0
            ? "You're on standard wholesale pricing."
            : `Your ${percent}% tier discount is applied to every coffee.`}{" "}
          Orders start at {CHECKOUT_MOQ_KG}kg.
        </span>
      </p>

      {products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          The catalog is empty right now. New coffees will appear here as soon
          as they&apos;re listed.
        </p>
      ) : (
        <div className="mt-10">
          <CatalogGrid products={products} tier={user.tier} />
        </div>
      )}
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading catalog">
      <div className="mt-3 h-6 w-80 max-w-full animate-pulse rounded-full bg-muted" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-[26rem] animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
