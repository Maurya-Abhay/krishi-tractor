"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/calculations";

export type CustomerSelectionItem = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  pending: number;
  workTotal: number;
  paidTotal: number;
};

interface CustomerSelectDialogProps {
  customers: CustomerSelectionItem[];
  selectedCustomerId?: string;
  onSelect: (customer: CustomerSelectionItem) => void;
  title: string;
  description: string;
  triggerLabel: string;
}

export function CustomerSelectDialog({
  customers,
  selectedCustomerId,
  onSelect,
  title,
  description,
  triggerLabel,
}: CustomerSelectDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => {
      return [customer.name, customer.address, customer.phone]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [customers, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-none p-3">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          <div className="rounded-none border border-border bg-card p-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Customers</p>
                <p className="text-xs text-muted-foreground">{customers.length} total customers</p>
              </div>
              <p className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                {filteredCustomers.length} shown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, address or phone"
              className="py-2"
            />
          </div>

          <div className="grid gap-3">
            {filteredCustomers.map((customer) => {
              const isSelected = customer.id === selectedCustomerId;
              return (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => {
                    onSelect(customer);
                    setOpen(false);
                  }}
                  className={`rounded-none border p-2 text-left transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:border-primary/80 hover:bg-primary/5 ${
                    isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.address}</p>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {formatCurrency(customer.pending)} pending
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatCurrency(customer.workTotal)} work value • {formatCurrency(customer.paidTotal)} paid
                  </p>
                </button>
              );
            })}
            {filteredCustomers.length === 0 && (
              <div className="rounded-none border border-dashed border-border bg-card p-4 text-center text-sm text-muted-foreground">
                No matching customer found.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
