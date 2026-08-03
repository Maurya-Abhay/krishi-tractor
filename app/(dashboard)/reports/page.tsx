import { listCustomers } from "@/lib/data/customers";
import { ReportsPageClient } from "@/components/dashboard/reports-page-client";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function ReportsPage() {
  const customers = await listCustomers();

  return <ReportsPageClient customers={customers} />;
}
