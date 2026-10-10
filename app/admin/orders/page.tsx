import { Suspense } from "react";
import type { Metadata } from "next";
import { StatusSelect } from "@/components/admin/status-select";
import { InvoiceDialog } from "@/components/orders/invoice-dialog";
import { StatusBadge } from "@/components/orders/status-badge";
import { TableSkeleton } from "@/components/table-skeleton";
import { TierBadge } from "@/components/tier-badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrders } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { formatMoney, invoiceNumber } from "@/lib/pricing";

export const metadata: Metadata = { title: "Orders · Admin" };

export default function AdminOrdersPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        Wholesale orders
      </h1>
      <p className="mt-3 text-muted-foreground">
        Every order from partner cafés, newest first.
      </p>
      <div className="mt-8">
        <Suspense fallback={<TableSkeleton rows={8} />}>
          <AllOrders />
        </Suspense>
      </div>
    </>
  );
}

async function AllOrders() {
  const orders = await getAllOrders();

  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No orders yet. They&apos;ll show up here as soon as a client checks out.
      </p>
    );
  }

  const pending = orders.filter((order) => order.status === "PENDING");
  const stats = [
    { label: "Awaiting invoice", value: String(pending.length) },
    { label: "Total orders", value: String(orders.length) },
    {
      label: "Order value",
      value: formatMoney(
        orders.reduce((sum, order) => sum + order.totalAmount, 0)
      ),
    },
  ];

  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-muted/40 p-4">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-heading text-3xl tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <Card className="mt-6 py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="text-right">Weight</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update</TableHead>
              <TableHead className="pr-4">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const number = invoiceNumber(order.id);
              return (
                <TableRow key={order.id}>
                  <TableCell className="pl-4 font-medium">{number}</TableCell>
                  <TableCell>
                    {order.client ? (
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium">
                            {order.client.companyName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.client.email}
                          </div>
                        </div>
                        <TierBadge tier={order.client.tier} />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Deleted account
                      </span>
                    )}
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
                  <TableCell>
                    <StatusSelect
                      orderId={order.id}
                      status={order.status}
                      label={number}
                    />
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <InvoiceDialog order={order} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
