"use client";

import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustomerForm } from "@/components/customers/customer-form";
import { useUpdateCustomer } from "@/hooks/use-customers";
import type { CustomerInput } from "@/lib/validations/customer";

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: { id: string; name: string; address: string; phone: string | null };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useUpdateCustomer(customer.id);

  function handleSubmit(data: CustomerInput) {
    mutate(data, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <CustomerForm
            defaultValues={{
              name: customer.name,
              address: customer.address,
              phone: customer.phone ?? "",
            }}
            onSubmit={handleSubmit}
            isPending={isPending}
            submitLabel="Update Customer"
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
