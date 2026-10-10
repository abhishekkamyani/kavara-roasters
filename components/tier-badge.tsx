import { Badge } from "@/components/ui/badge";
import type { Tier } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TIER_STYLES: Record<Tier, string> = {
  BRONZE: "bg-[#b0764a] text-[#17120e]",
  SILVER: "bg-[#c9ccd1] text-[#17120e]",
  GOLD: "bg-gold text-espresso",
};

export const TIER_LABELS: Record<Tier, string> = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
};

export function TierBadge({
  tier,
  className,
}: {
  tier: Tier;
  className?: string;
}) {
  return (
    <Badge className={cn(TIER_STYLES[tier], className)}>
      {TIER_LABELS[tier]}
    </Badge>
  );
}
