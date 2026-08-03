"use client";

import { useMemo, useState } from "react";
import { Hammer } from "lucide-react";
import { AddWorkEntryDialog } from "@/components/work-entries/add-work-entry-dialog";
import { WorkEntryTable } from "@/components/work-entries/work-entry-table";
import { CustomerSelectDialog, type CustomerSelectionItem } from "@/components/dashboard/customer-select-dialog";
import { useCustomer } from "@/hooks/use-customers";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/calculations";

type RecentWorkItem = {
  id: string;
  date: string;
  total: string;
  customer: { name: string };
  service: { name: string };
};

interface WorkEntriesPageClientProps {
  customers: CustomerSelectionItem[];
  todayWorkCount: number;
  todayWorkAmount: number;
  recentWork: RecentWorkItem[];
}

export function WorkEntriesPageClient({
  customers,
  todayWorkCount,
  todayWorkAmount,
  recentWork,
}: WorkEntriesPageClientProps) {
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
          <h1 className="text-lg font-semibold tracking-tight">Work entries</h1>
          <p className="text-xs text-muted-foreground">
            Add work, review today&apos;s performance, and manage customer history in one place.
          </p>
        </div>
        <CustomerSelectDialog
          customers={customers}
          selectedCustomerId={selectedCustomerId ?? undefined}
          onSelect={(customer) => setSelectedCustomerId(customer.id)}
          title="Select customer for work"
          description="Choose the customer to add work entries for."
          triggerLabel="Select Customer"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
              <CardHeader>
                <CardTitle>Work today</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 p-2">
                <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                  <p className="text-xs text-muted-foreground">Entries</p>
                  <p className="mt-1 text-xl font-semibold">{todayWorkCount}</p>
                </div>
                <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                  <p className="text-xs text-muted-foreground">Total value</p>
                  <p className="mt-1 text-xl font-semibold">{formatCurrency(todayWorkAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
              <CardHeader>
                <CardTitle>{selectedCustomer ? "Selected customer" : "Select a customer"}</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                {!selectedCustomer ? (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Select a customer to start adding work entries right away.</p>
                    <Button onClick={() => setSelectedCustomerId(customers[0]?.id ?? null)} variant="secondary">
                      Pick first customer
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
                        <p className="text-muted-foreground">Total work</p>
                        <p className="mt-1 text-sm font-semibold">{formatCurrency(selectedCustomer.workTotal)}</p>
                      </div>
                    </div>
                    <AddWorkEntryDialog customerId={selectedCustomer.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
            <CardHeader>
              <CardTitle>Recent work</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentWork.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No recent work entries yet.</p>
              ) : (
                <div className="">
                  {recentWork.map((entry) => (
                    <div key={entry.id} className="border-b border-border/70 last:border-b-0 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{entry.service.name}</p>
                          <p className="text-sm text-muted-foreground">{entry.customer.name}</p>
                        </div>
                        <p className="text-lg font-semibold">{formatCurrency(Number(entry.total))}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle>Customer history</CardTitle>
              </CardHeader>
              <CardContent>
                {customerQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading customer history…</p>
                ) : customerQuery.isError ? (
                  <p className="text-sm text-destructive">Unable to load history.</p>
                ) : customerDetails ? (
                  <WorkEntryTable customerId={selectedCustomer.id} workEntries={customerDetails.workEntries} />
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={Hammer}
              title="Choose a customer"
              description="Open the selector above to begin working with customer records."
            />
          )}
        </div>
      </div>
    </div>
  );
}
