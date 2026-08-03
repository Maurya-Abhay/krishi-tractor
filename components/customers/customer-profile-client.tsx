"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkEntryTable = dynamic(
  () => import("@/components/work-entries/work-entry-table").then((m) => m.WorkEntryTable),
  { ssr: false }
);
const PaymentTable = dynamic(
  () => import("@/components/payments/payment-table").then((m) => m.PaymentTable),
  { ssr: false }
);
const ReportGenerator = dynamic(
  () => import("@/components/reports/report-generator").then((m) => m.ReportGenerator),
  { ssr: false }
);

export default function CustomerProfileClient({
  customerId,
  history,
}: {
  customerId: string;
  history: any;
}) {
  return (
    <Tabs defaultValue="work">
      <TabsList>
        <TabsTrigger value="work">Work History</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
        <TabsTrigger value="report">Report</TabsTrigger>
      </TabsList>
      <TabsContent value="work">
        <Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
          <WorkEntryTable customerId={customerId} workEntries={history.workEntries} />
        </Suspense>
      </TabsContent>
      <TabsContent value="payments">
        <Suspense fallback={<div className="h-24 animate-pulse rounded bg-muted" />}>
          <PaymentTable customerId={customerId} payments={history.payments} />
        </Suspense>
      </TabsContent>
      <TabsContent value="report">
        <Suspense fallback={<div className="h-20 animate-pulse rounded bg-muted" />}>
          <ReportGenerator customerId={customerId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
