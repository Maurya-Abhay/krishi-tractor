import { getDashboardStats } from "@/lib/data/dashboard";
import { listCustomers } from "@/lib/data/customers";
import { PaymentsPageClient } from "@/components/dashboard/payments-page-client";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const [stats, customers] = await Promise.all([getDashboardStats(), listCustomers()]);

  return (
    <PaymentsPageClient
      customers={customers}
      todayCollection={stats.todayCollection}
      pendingAmount={stats.pendingAmount}
    />
  );
}
