import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/admin/client-form";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = { title: "New client · Admin" };

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Clients
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
        New client
      </h1>
      <p className="mt-3 text-muted-foreground">
        The café can sign in and order as soon as you create the account.
      </p>
      <div className="mt-8">
        <Suspense
          fallback={<div className="h-96 animate-pulse rounded-xl bg-muted" />}
        >
          <AdminOnlyForm />
        </Suspense>
      </div>
    </div>
  );
}

async function AdminOnlyForm() {
  await requireAdmin();
  return <ClientForm />;
}
