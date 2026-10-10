import Link from "next/link";
import { cn } from "@/lib/utils";

/** The KV monogram. Keep in sync with app/icon.svg, which is the tab icon. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="64" height="64" rx="14" fill="#17120e" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="12.5"
        stroke="#d4af37"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <g strokeWidth="5.5" strokeLinejoin="bevel" strokeLinecap="butt">
        <path d="M12 19v26M26 19 13.5 32 26 45" stroke="#d4af37" />
        <path d="m32 19 9.5 26L51 19" stroke="#f4ede4" />
      </g>
    </svg>
  );
}

export function Brand({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Kavara Roasters"
      className={cn("flex items-center gap-2.5 whitespace-nowrap", className)}
    >
      <LogoMark />
      <span className="flex items-baseline gap-2">
        <span className="font-heading text-xl font-semibold tracking-tight">
          Kavara
        </span>
        <span className="hidden text-[0.65rem] font-medium tracking-[0.28em] text-gold-ink uppercase sm:inline">
          Roasters
        </span>
      </span>
    </Link>
  );
}
