import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/calculations";
import type { Prisma } from "@prisma/client";

type RecentWork = Prisma.WorkEntryGetPayload<{
  include: { customer: { select: { name: true } }; service: { select: { name: true } } };
}>;
type RecentPayment = Prisma.PaymentGetPayload<{
  include: { customer: { select: { name: true } } };
}>;

export function RecentActivity({
  recentWork,
  recentPayments,
}: {
  recentWork: RecentWork[];
  recentPayments: RecentPayment[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden relative transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] rounded-none shadow-2xl bg-card dark:bg-card">
        <CardHeader>
          <CardTitle>Recent Work Entries</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0 p-0">
              {recentWork.length === 0 && (
            <p className="py-3 text-sm text-muted-foreground">No work entries yet.</p>
          )}
          {recentWork.map((w) => (
            <Link
              key={w.id}
              href={`/customers/${w.customerId}`}
              className="flex items-center justify-between rounded-none px-3 py-2 transition-subtle hover:bg-secondary border-b border-border/70 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium">{w.customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {w.service.name} • {formatDate(w.date)}
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(Number(w.total))}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden relative transform-gpu transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] rounded-none shadow-2xl bg-card dark:bg-card">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-0 p-0">
              {recentPayments.length === 0 && (
            <p className="py-3 text-sm text-muted-foreground">No payments yet.</p>
          )}
          {recentPayments.map((p) => (
            <Link
              key={p.id}
              href={`/customers/${p.customerId}`}
              className="flex items-center justify-between rounded-none px-3 py-2 transition-subtle hover:bg-secondary border-b border-border/70 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium">{p.customer.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(p.date)}</p>
              </div>
              <p className="text-sm font-semibold text-success">
                {formatCurrency(Number(p.amount))}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
