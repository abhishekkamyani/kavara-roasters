"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateClientTier } from "@/app/admin/clients/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIERS, type Tier } from "@/lib/constants";
import { TIER_LABELS } from "@/components/tier-badge";
import { discountPercent } from "@/lib/pricing";

export function TierSelect({
  clientId,
  companyName,
  tier,
}: {
  clientId: string;
  companyName: string;
  tier: Tier;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      const result = await updateClientTier(clientId, next as Tier);
      if (result.ok) {
        toast.success(`${companyName} moved to ${TIER_LABELS[next as Tier]}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Select value={tier} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        className="w-40"
        aria-label={`Tier for ${companyName}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIERS.map((option) => (
          <SelectItem key={option} value={option}>
            {TIER_LABELS[option]} · {discountPercent(option)}% off
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
