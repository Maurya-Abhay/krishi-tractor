import { Hammer, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/calculations";

export function CustomerSummaryCards({
  workTotal,
  paidTotal,
  pending,
}: {
  workTotal: number;
  paidTotal: number;
  pending: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
        <CardContent className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-secondary">
            <Hammer className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Work Amount</p>
            <p className="text-base font-semibold">{formatCurrency(workTotal)}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
        <CardContent className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-success/10">
            <Wallet className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="text-base font-semibold">{formatCurrency(paidTotal)}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
        <CardContent className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending Amount</p>
            <p className="text-base font-semibold text-destructive">{formatCurrency(pending)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
