import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = { title: "New product · Admin" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Products
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        New product
      </h1>
      <p className="mt-3 text-muted-foreground">
        It appears in every client&apos;s catalog as soon as you save.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="h-[34rem] animate-pulse rounded-xl bg-muted" />}
        >
          <AdminOnlyForm />
        </Suspense>
      </div>
    </div>
  );
}

async function AdminOnlyForm() {
  await requireAdmin();
  return <ProductForm />;
}
