import { getDashboardStats } from "@/lib/data/dashboard";
import { listCustomers } from "@/lib/data/customers";
import { WorkEntriesPageClient } from "@/components/dashboard/work-entries-page-client";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function WorkPage() {
  const [stats, customers] = await Promise.all([getDashboardStats(), listCustomers()]);

  return (
    <WorkEntriesPageClient
      customers={customers}
      todayWorkCount={stats.todayWorkCount}
      todayWorkAmount={stats.todayWorkAmount}
      recentWork={stats.recentWork}
    />
  );
}
