"use client";

import { Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useDeletePayment } from "@/hooks/use-payments";
import { formatCurrency, formatDate } from "@/lib/calculations";

export function PaymentTable({ customerId, payments }: { customerId: string; payments: any[] }) {
  const { mutate: deletePayment, isPending } = useDeletePayment(customerId);

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No payments yet"
        description="Record the first payment for this customer."
        compact
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="w-14" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDate(payment.date)}</TableCell>
            <TableCell className="font-medium text-success">
              {formatCurrency(Number(payment.amount))}
            </TableCell>
            <TableCell>{payment.note ?? "-"}</TableCell>
            <TableCell>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                title="Delete this payment?"
                onConfirm={() => deletePayment(payment.id)}
                isPending={isPending}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
