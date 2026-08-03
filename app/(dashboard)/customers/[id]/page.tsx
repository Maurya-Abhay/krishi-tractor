import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCustomerById, getCustomerSummary, getCustomerHistory } from "@/lib/data/customers";
import { CustomerSummaryCards } from "@/components/customers/customer-summary-cards";
import { AddWorkEntryDialog } from "@/components/work-entries/add-work-entry-dialog";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { Suspense } from "react";
import CustomerProfileClient from "@/components/customers/customer-profile-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const [summary, history] = await Promise.all([getCustomerSummary(id), getCustomerHistory(id)]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2">
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{customer.name}</h1>
            <p className="text-xs text-muted-foreground">
              {customer.address}
              {customer.phone ? ` • ${customer.phone}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <AddPaymentDialog customerId={customer.id} />
            <AddWorkEntryDialog customerId={customer.id} />
          </div>
        </div>
      </div>

      <CustomerSummaryCards
        workTotal={summary.workTotal}
        paidTotal={summary.paidTotal}
        pending={summary.pending}
      />

      <Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
        <CustomerProfileClient customerId={customer.id} history={history} />
      </Suspense>
    </div>
  );
}
