import { listCustomers } from "@/lib/data/customers";
import { ReportsPageClient } from "@/components/dashboard/reports-page-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const customers = await listCustomers();

  return <ReportsPageClient customers={customers} />;
}
