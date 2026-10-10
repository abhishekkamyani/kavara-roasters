import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/dal";
import { getProduct } from "@/lib/data";

export const metadata: Metadata = { title: "Edit product · Admin" };

export default function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
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
        Edit product
      </h1>
      <p className="mt-3 text-muted-foreground">
        Changes show up in every client&apos;s catalog as soon as you save.
        Orders already placed keep the price they were placed at.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="h-[34rem] animate-pulse rounded-xl bg-muted" />}
        >
          <EditForm params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditForm({
  params,
}: Pick<PageProps<"/admin/products/[id]/edit">, "params">) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return <ProductForm product={product} />;
}
