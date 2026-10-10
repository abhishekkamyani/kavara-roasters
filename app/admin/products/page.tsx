import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/dal";
import { getProducts } from "@/lib/data";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = { title: "Products · Admin" };

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Products
          </h1>
          <p className="mt-3 text-muted-foreground">
            The wholesale catalog clients order from.
          </p>
        </div>
        <Button asChild className="h-9">
          <Link href="/admin/products/new">
            <Plus data-icon="inline-start" />
            New product
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <Suspense fallback={<TableSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </>
  );
}

async function ProductList() {
  await requireAdmin();
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No products yet. Add the first one to open the catalog.
      </p>
    );
  }

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Coffee</TableHead>
            <TableHead>Roast</TableHead>
            <TableHead className="text-right">Base price / kg</TableHead>
            <TableHead className="text-right">Minimum</TableHead>
            <TableHead className="pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-espresso">
                    <Image
                      src={product.imageUrl}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.origin}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.roastLevel}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(product.basePrice)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {product.moqKg}kg
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil data-icon="inline-start" />
                      Edit
                      <span className="sr-only"> {product.name}</span>
                    </Link>
                  </Button>
                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
