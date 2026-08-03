"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Users, Pencil, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useCustomers, useDeleteCustomer, useDebouncedValue } from "@/hooks/use-customers";
import { EditCustomerDialog } from "@/components/customers/edit-customer-dialog";
import { formatCurrency } from "@/lib/calculations";

export function CustomerTable({ initialCustomers }: { initialCustomers?: any[] }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const { data, isLoading, isFetching, isError } = useCustomers(debouncedSearch, {
    customers: initialCustomers ?? [],
  });
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by customer name..."
          className="pl-9 pr-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isFetching && !isLoading && (
          <div className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load customers. Please refresh the page.
        </div>
      )}

      {!isLoading && !isError && data?.customers.length === 0 && (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start tracking work and payments."
        />
      )}

      {!isLoading && !isError && data && data.customers.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.customers.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link href={`/customers/${c.id}`} className="font-medium hover:underline">
                    {c.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden max-w-xs truncate md:table-cell">{c.address}</TableCell>
                <TableCell className="hidden sm:table-cell">{c.phone ?? "-"}</TableCell>
                <TableCell>
                  <Badge variant={c.pending > 0 ? "destructive" : "success"}>
                    {formatCurrency(c.pending)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/customers/${c.id}`}>
                            <User className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingCustomer(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                    <ConfirmDeleteDialog
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title={`Delete ${c.name}?`}
                      description="This will permanently delete this customer along with all their work and payment history."
                      onConfirm={() => deleteCustomer(c.id)}
                      isPending={isDeleting}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingCustomer && (
        <EditCustomerDialog
          customer={editingCustomer}
          open={!!editingCustomer}
          onOpenChange={(open) => !open && setEditingCustomer(null)}
        />
      )}
    </div>
  );
}
