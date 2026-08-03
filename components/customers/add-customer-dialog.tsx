"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerForm } from "@/components/customers/customer-form";
import { useCreateCustomer } from "@/hooks/use-customers";
import type { CustomerInput } from "@/lib/validations/customer";

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCustomer();

  function handleSubmit(data: CustomerInput) {
    mutate(data, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-3 py-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <CustomerForm onSubmit={handleSubmit} isPending={isPending} submitLabel="Add Customer" />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
