import { Suspense, type ReactNode } from "react";
import { Brand } from "@/components/brand";
import {
  PortalNav,
  PortalNavFallback,
  type NavLink,
} from "@/components/portal-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { TierBadge } from "@/components/tier-badge";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/dal";

async function UserChip() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-40 truncate text-sm text-muted-foreground md:inline">
        {user.companyName}
      </span>
      {user.role === "ADMIN" ? (
        <Badge variant="outline">Admin</Badge>
      ) : (
        <TierBadge tier={user.tier} />
      )}
    </div>
  );
}

export function PortalHeader({
  home,
  links,
  children,
}: {
  home: string;
  links: NavLink[];
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Brand href={home} />
        <Suspense fallback={<PortalNavFallback links={links} />}>
          <PortalNav links={links} />
        </Suspense>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Suspense
            fallback={
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            }
          >
            <UserChip />
          </Suspense>
          {children}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
