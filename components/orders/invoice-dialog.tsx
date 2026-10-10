import { StatusBadge } from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { OrderDTO } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { formatMoney, invoiceNumber } from "@/lib/pricing";

export function InvoiceDialog({ order }: { order: OrderDTO }) {
  const number = invoiceNumber(order.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View<span className="sr-only"> invoice {number}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            Invoice {number}
            <StatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>
            Placed {formatDate(order.createdAt)}
            {order.client && ` · ${order.client.companyName}`}
          </DialogDescription>
        </DialogHeader>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="py-2 font-medium">Coffee</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Per kg</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId || item.name} className="border-b">
                <td className="py-2.5 pr-3">
                  <span className="font-medium">{item.name}</span>
                  {item.origin && (
                    <span className="block text-xs text-muted-foreground">
                      {item.origin}
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {item.quantity}kg
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {formatMoney(item.priceAtPurchase)}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {formatMoney(item.priceAtPurchase * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 text-muted-foreground">
                Total · {order.totalKg}kg
              </td>
              <td
                colSpan={3}
                className="pt-3 text-right font-heading text-xl font-semibold tabular-nums"
              >
                {formatMoney(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </DialogContent>
    </Dialog>
  );
}
