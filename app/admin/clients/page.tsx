import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TierSelect } from "@/components/admin/tier-select";
import { TableSkeleton } from "@/components/table-skeleton";
import { TierBadge } from "@/components/tier-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClients } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Clients · Admin" };

export default function AdminClientsPage() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            Clients
          </h1>
          <p className="mt-3 text-muted-foreground">
            Cafés with a wholesale account. Their tier sets their pricing.
          </p>
        </div>
        <Button asChild className="h-9">
          <Link href="/admin/clients/new">
            <Plus data-icon="inline-start" />
            New client
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <Suspense fallback={<TableSkeleton />}>
          <ClientList />
        </Suspense>
      </div>
    </>
  );
}

async function ClientList() {
  const clients = await getClients();

  if (clients.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
        No clients yet. Add a café to give it access to the catalog.
      </p>
    );
  }

  return (
    <Card className="py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Company</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="pr-4">Change tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="pl-4">
                <div className="font-medium">{client.companyName}</div>
                <div className="text-xs text-muted-foreground">
                  {client.email}
                </div>
              </TableCell>
              <TableCell>
                <TierBadge tier={client.tier} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {client.orderCount}
              </TableCell>
              <TableCell>{formatDate(client.createdAt)}</TableCell>
              <TableCell className="pr-4">
                <TierSelect
                  clientId={client.id}
                  companyName={client.companyName}
                  tier={client.tier}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
