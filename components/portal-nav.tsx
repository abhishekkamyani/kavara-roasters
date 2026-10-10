"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NavLink = { href: string; label: string };

function NavLinks({
  links,
  activeHref,
}: {
  links: NavLink[];
  activeHref?: string;
}) {
  return (
    <nav className="flex items-center gap-1" aria-label="Portal">
      {links.map((link) => {
        const isActive = link.href === activeHref;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="portal-nav-pill"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Reads the pathname, which is request data on dynamic routes such as
 * /admin/products/[id]/edit, so render it inside <Suspense> with
 * PortalNavFallback.
 */
export function PortalNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  // The most specific matching link wins, so /admin/products/new doesn't
  // also light up /admin/products.
  const active = links
    .filter(
      (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  return <NavLinks links={links} activeHref={active?.href} />;
}

/** The same links with nothing highlighted yet. */
export function PortalNavFallback({ links }: { links: NavLink[] }) {
  return <NavLinks links={links} />;
}
