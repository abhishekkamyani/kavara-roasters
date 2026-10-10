import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { InvoiceDialog } from "@/components/orders/invoice-dialog";
import { StatusBadge } from "@/components/orders/status-badge";
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
import { getMyOrders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { formatMoney, invoiceNumber } from "@/lib/pricing";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        Orders &amp; invoices
      </h1>
      <p className="mt-3 text-muted-foreground">
        Every wholesale order you&apos;ve placed, newest first.
      </p>
      <div className="mt-8">
        <Suspense fallback={<TableSkeleton />}>
          <MyOrders />
        </Suspense>
      </div>
    </>
  );
}

async function MyOrders() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-muted-foreground">
          You haven&apos;t placed an order yet.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Browse the catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Invoice</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead className="text-right">Weight</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4">
              <span className="sr-only">Details</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="pl-4 font-medium">
                {invoiceNumber(order.id)}
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {order.totalKg}kg
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(order.totalAmount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="pr-4 text-right">
                <InvoiceDialog order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
