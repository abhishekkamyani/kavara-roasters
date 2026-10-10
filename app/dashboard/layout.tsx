import { CartDrawer } from "@/components/cart/cart-drawer";
import type { Metadata } from "next";
import { PortalHeader } from "@/components/portal-header";

// Everything in here needs a session, so keep it out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const links = [
  { href: "/dashboard", label: "Catalog" },
  { href: "/dashboard/orders", label: "Orders" },
];

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <PortalHeader home="/dashboard" links={links}>
        <CartDrawer />
      </PortalHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
