"use client";

import { useMemo, useState } from "react";
import { Wallet, IndianRupee } from "lucide-react";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { PaymentTable } from "@/components/payments/payment-table";
import { CustomerSelectDialog, type CustomerSelectionItem } from "@/components/dashboard/customer-select-dialog";
import { useCustomer } from "@/hooks/use-customers";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/calculations";

interface PaymentsPageClientProps {
  customers: CustomerSelectionItem[];
  todayCollection: number;
  pendingAmount: number;
}

export function PaymentsPageClient({ customers, todayCollection, pendingAmount }: PaymentsPageClientProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  const customerQuery = useCustomer(selectedCustomerId ?? "");
  const customerDetails = customerQuery.data;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Payments</h1>
          <p className="text-xs text-muted-foreground">
            Record payments quickly and see how much you collected today.
          </p>
        </div>
        <CustomerSelectDialog
          customers={customers}
          selectedCustomerId={selectedCustomerId ?? undefined}
          onSelect={(customer) => setSelectedCustomerId(customer.id)}
          title="Select customer for payment"
          description="Choose the customer to record a payment for."
          triggerLabel="Select Customer"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
              <CardHeader>
                <CardTitle>Today&#39;s collection</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 p-2">
                <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                  <p className="text-xs text-muted-foreground">Collected today</p>
                  <p className="mt-1 text-2xl font-semibold">{formatCurrency(todayCollection)}</p>
                </div>
                <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                  <p className="text-xs text-muted-foreground">Pending balance</p>
                  <p className="mt-1 text-2xl font-semibold">{formatCurrency(pendingAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
              <CardHeader>
                <CardTitle>{selectedCustomer ? "Selected customer" : "Ready to collect"}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {!selectedCustomer ? (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Select a customer to start recording a payment instantly.</p>
                    <Button onClick={() => setSelectedCustomerId(customers[0]?.id ?? null)} variant="secondary" size="sm">
                      Pick the first customer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                      <p className="text-sm font-semibold">{selectedCustomer.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedCustomer.address}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                        <p className="text-muted-foreground">Pending</p>
                        <p className="mt-1 text-sm font-semibold">{formatCurrency(selectedCustomer.pending)}</p>
                      </div>
                      <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                        <p className="text-muted-foreground">Total paid</p>
                        <p className="mt-1 text-sm font-semibold">{formatCurrency(selectedCustomer.paidTotal)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AddPaymentDialog customerId={selectedCustomer.id} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle>Customer payments</CardTitle>
              </CardHeader>
              <CardContent>
                {customerQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading customer payments…</p>
                ) : customerQuery.isError ? (
                  <p className="text-sm text-destructive">Failed to load payments.</p>
                ) : customerDetails ? (
                  <PaymentTable customerId={selectedCustomer.id} payments={customerDetails.payments} />
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={Wallet}
              title="Select a customer"
              description="Pick a customer to start recording payments and viewing payment history."
            />
          )}
        </div>
      </div>
    </div>
  );
}
