"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/admin/actions";
import { STATUS_LABELS } from "@/components/orders/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/constants";

export function StatusSelect({
  orderId,
  status,
  label,
}: {
  orderId: string;
  status: OrderStatus;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next as OrderStatus);
      if (result.ok) {
        toast.success(`${label} marked ${STATUS_LABELS[next as OrderStatus]}`);
      } else {
        toast.error(result.error ?? "Could not update the order.");
      }
    });
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger size="sm" className="w-32" aria-label={`Status of ${label}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            {STATUS_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
