"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Printer, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/calculations";

function defaultStartDate() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

export function ReportGenerator({ customerId }: { customerId: string }) {
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [generated, setGenerated] = useState(false);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["report", customerId, startDate, endDate],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/${customerId}?startDate=${startDate}&endDate=${endDate}`
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to generate report");
      return body.report;
    },
    enabled: false,
  });

  async function handleGenerate() {
    await refetch();
    setGenerated(true);
  }

  function handlePrint() {
    // Open PDF inline in a new tab for printing (server will return inline when download=false)
    window.open(`/api/reports/${customerId}/pdf?startDate=${startDate}&endDate=${endDate}&download=false`, "_blank");
  }

  function handleExportPdf() {
    // use default (download behavior)
    window.open(`/api/reports/${customerId}/pdf?startDate=${startDate}&endDate=${endDate}`, "_blank");
  }

  return (
    <Card className="rounded-none shadow-2xl bg-card dark:bg-card">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 rounded-none py-1 px-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9 rounded-none py-1 px-2"
            />
          </div>
          <div className="flex items-end">
            <Button size="sm" onClick={handleGenerate} disabled={isFetching} className="w-full sm:w-auto">
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              <span className="ml-2">Generate Report</span>
            </Button>
          </div>
        </div>

        {generated && data && (
          <div className="mt-2 flex flex-col gap-2 rounded-none border border-border p-2 print:border-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {formatDate(data.range.startDate)} – {formatDate(data.range.endDate)}
              </p>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPdf}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Total Work</p>
                <p className="font-semibold">{formatCurrency(data.totalWork)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Paid</p>
                <p className="font-semibold text-success">{formatCurrency(data.totalPaid)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Pending Balance</p>
                <p className="font-semibold text-destructive">{formatCurrency(data.pendingBalance)}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">Work Entries ({data.workEntries.length})</p>
              <div className="flex flex-col divide-y divide-border text-sm">
                {data.workEntries.map((w: any) => (
                  <div key={w.id} className="flex justify-between py-1">
                    <span>
                      {formatDate(w.date)} — {w.service.name}
                    </span>
                    <span className="font-medium">{formatCurrency(Number(w.total))}</span>
                  </div>
                ))}
                {data.workEntries.length === 0 && (
                  <p className="py-1 text-muted-foreground">No work entries in this period.</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">Payments ({data.payments.length})</p>
              <div className="flex flex-col divide-y divide-border text-sm">
                {data.payments.map((p: any) => (
                  <div key={p.id} className="flex justify-between py-1">
                    <span>{formatDate(p.date)}</span>
                    <span className="font-medium text-success">{formatCurrency(Number(p.amount))}</span>
                  </div>
                ))}
                {data.payments.length === 0 && (
                  <p className="py-1 text-muted-foreground">No payments in this period.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
