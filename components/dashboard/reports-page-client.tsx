"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { CustomerSelectDialog, type CustomerSelectionItem } from "@/components/dashboard/customer-select-dialog";
import { ReportGenerator } from "@/components/reports/report-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/calculations";

interface ReportsPageClientProps {
  customers: CustomerSelectionItem[];
}

export function ReportsPageClient({ customers }: ReportsPageClientProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Reports</h1>
          <p className="text-xs text-muted-foreground">
            Generate a date-range report for any customer and export it as PDF.
          </p>
        </div>
        <CustomerSelectDialog
          customers={customers}
          selectedCustomerId={selectedCustomerId ?? undefined}
          onSelect={(customer) => setSelectedCustomerId(customer.id)}
          title="Select customer for report"
          description="Choose the customer whose report you want to generate."
          triggerLabel="Select Customer"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-4">
          <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground p-2">
              <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                <p className="font-semibold">1. Pick a customer</p>
                <p className="mt-1 text-xs">Choose the right customer from the selector.</p>
              </div>
              <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                <p className="font-semibold">2. Choose dates</p>
                <p className="mt-1 text-xs">Select the start and end dates for the report.</p>
              </div>
              <div className="rounded-none border border-border bg-card/60 dark:bg-card/50 p-2">
                <p className="font-semibold">3. Export PDF</p>
                <p className="mt-1 text-xs">Download or preview the report for sharing.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
            <CardHeader>
              <CardTitle>{selectedCustomer ? "Report details" : "Select a customer first"}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {selectedCustomer ? (
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
                      <p className="text-muted-foreground">Work total</p>
                      <p className="mt-1 text-sm font-semibold">{formatCurrency(selectedCustomer.workTotal)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Choose a customer to generate their report and preview PDF options.</p>
                  <Button onClick={() => setSelectedCustomerId(customers[0]?.id ?? null)} variant="secondary" size="sm">
                    Pick first customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate report</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportGenerator customerId={selectedCustomer.id} />
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Select a customer"
              description="Pick a customer to generate their report and download a PDF."
            />
          )}
        </div>
      </div>
    </div>
  );
}
