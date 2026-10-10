import { PortalHeader } from "@/components/portal-header";

const links = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/clients", label: "Clients" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <PortalHeader home="/admin/orders" links={links} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
