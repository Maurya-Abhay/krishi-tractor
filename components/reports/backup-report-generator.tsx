"use client";

import { useState } from "react";
import { Download, FileText, Loader2, Printer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate } from "@/lib/calculations";
import type { BackupReport } from "@/lib/data/reports";

function defaultStartDate() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

export function BackupReportGenerator() {
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [generated, setGenerated] = useState(false);

  const { data, isFetching, refetch } = useQuery<BackupReport>({
    queryKey: ["backup-report", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/backup?startDate=${startDate}&endDate=${endDate}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to generate backup report");
      return body.report;
    },
    enabled: false,
  });

  async function handleGenerate() {
    await refetch();
    setGenerated(true);
  }

  function handleOpenPdf() {
    window.open(`/api/reports/backup/pdf?startDate=${startDate}&endDate=${endDate}&download=false`, "_blank");
  }

  function handleDownloadPdf() {
    window.open(`/api/reports/backup/pdf?startDate=${startDate}&endDate=${endDate}`, "_blank");
  }

  return (
    <Card className="rounded-none shadow-2xl bg-card dark:bg-card">
      <CardHeader>
        <CardTitle>Backup summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="backupStartDate">Start Date</Label>
            <Input
              id="backupStartDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 rounded-none py-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="backupEndDate">End Date</Label>
            <Input
              id="backupEndDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 rounded-none py-1 px-2"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button size="sm" onClick={handleGenerate} disabled={isFetching} className="w-full sm:w-auto">
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              <span className="ml-2">Generate</span>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/reports">Back to reports</Link>
            </Button>
          </div>
        </div>

        {generated && data && (
          <div className="space-y-4 rounded-none border border-border p-3 text-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(data.range.startDate)} – {formatDate(data.range.endDate)}
                </p>
                <p className="text-sm font-semibold">{data.customerCount} customers</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleOpenPdf}>
                  <Printer className="h-4 w-4" />
                  <span className="ml-2">Preview PDF</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                  <Download className="h-4 w-4" />
                  <span className="ml-2">Download PDF</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-4">
              <div className="rounded-none border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="mt-1 text-base font-semibold">{data.customerCount}</p>
              </div>
              <div className="rounded-none border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Total work</p>
                <p className="mt-1 text-base font-semibold">{formatCurrency(data.totalWork)}</p>
              </div>
              <div className="rounded-none border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Total received</p>
                <p className="mt-1 text-base font-semibold">{formatCurrency(data.totalPaid)}</p>
              </div>
              <div className="rounded-none border border-border bg-card/60 p-3">
                <p className="text-xs text-muted-foreground">Total pending</p>
                <p className="mt-1 text-base font-semibold text-destructive">{formatCurrency(data.pendingBalance)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Customer balances</p>
              <div className="space-y-1 rounded-none border border-border bg-card/60 p-2">
                {data.customers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No customers found.</p>
                ) : (
                  data.customers.map((customer) => (
                    <div key={customer.id} className="grid grid-cols-1 gap-2 rounded-none border-b border-border px-2 py-2 last:border-b-0 sm:grid-cols-[1.5fr_1fr_1fr]">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-semibold text-success">{formatCurrency(customer.paidTotal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="font-semibold text-destructive">{formatCurrency(customer.pending)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
