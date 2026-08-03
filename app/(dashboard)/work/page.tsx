import { getDashboardStats } from "@/lib/data/dashboard";
import { listCustomers } from "@/lib/data/customers";
import { WorkEntriesPageClient } from "@/components/dashboard/work-entries-page-client";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [stats, customers] = await Promise.all([getDashboardStats(), listCustomers()]);

  const recentWork = (stats.recentWork ?? []).map((r: any) => ({
    id: r.id,
    date: r.date instanceof Date ? r.date.toISOString() : String(r.date),
    total: String(Number(r.total ?? 0)),
    customer: r.customer,
    service: r.service,
  }));

  return (
    <WorkEntriesPageClient
      customers={customers}
      todayWorkCount={stats.todayWorkCount}
      todayWorkAmount={stats.todayWorkAmount}
      recentWork={recentWork}
    />
  );
}
