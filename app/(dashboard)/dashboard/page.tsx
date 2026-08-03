import { Users, Hammer, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/calculations";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-base font-semibold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Overview of your business today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Customers" value={String(stats.totalCustomers)} icon={Users} />
        <StatCard
          label="Today's Work"
          value={`${stats.todayWorkCount} • ${formatCurrency(stats.todayWorkAmount)}`}
          icon={Hammer}
        />
        <StatCard
          label="Today's Collection"
          value={formatCurrency(stats.todayCollection)}
          icon={Wallet}
          accent="success"
        />
        <StatCard
          label="Pending Amount"
          value={formatCurrency(stats.pendingAmount)}
          icon={AlertCircle}
          accent="destructive"
        />
        <StatCard
          label="Received Amount"
          value={formatCurrency(stats.receivedAmount)}
          icon={CheckCircle2}
          accent="success"
        />
      </div>

      <RecentActivity recentWork={stats.recentWork} recentPayments={stats.recentPayments} />
    </div>
  );
}
