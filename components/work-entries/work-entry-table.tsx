"use client";

import { Trash2, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useDeleteWorkEntry } from "@/hooks/use-work-entries";
import { formatCurrency, formatDate } from "@/lib/calculations";

export function WorkEntryTable({ customerId, workEntries }: { customerId: string; workEntries: any[] }) {
  const { mutate: deleteEntry, isPending } = useDeleteWorkEntry(customerId);

  if (workEntries.length === 0) {
    return (
      <EmptyState
        icon={Hammer}
        title="No work entries yet"
        description="Add the first work entry for this customer."
        compact
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="w-14" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {workEntries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{formatDate(entry.date)}</TableCell>
            <TableCell>{entry.service.name}</TableCell>
            <TableCell>
              {entry.service.unit === "KATHA"
                ? `${Number(entry.katha)} Katha`
                : `${Number(entry.decimalHour)} hr`}
            </TableCell>
            <TableCell>{formatCurrency(Number(entry.rate))}</TableCell>
            <TableCell className="font-medium">{formatCurrency(Number(entry.total))}</TableCell>
            <TableCell>
              <ConfirmDeleteDialog
                trigger={
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                title="Delete this work entry?"
                onConfirm={() => deleteEntry(entry.id)}
                isPending={isPending}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
