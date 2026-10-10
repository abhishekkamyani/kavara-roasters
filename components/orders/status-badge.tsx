import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Tuned for crema panels, where every order table lives.
const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-200 text-amber-950",
  INVOICED: "bg-sky-200 text-sky-950",
  SHIPPED: "bg-emerald-200 text-emerald-950",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  INVOICED: "Invoiced",
  SHIPPED: "Shipped",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("font-sans", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
