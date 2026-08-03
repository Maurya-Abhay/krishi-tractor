"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/payments/payment-form";
import { useCreatePayment } from "@/hooks/use-payments";
import type { PaymentInput } from "@/lib/validations/payment";

export function AddPaymentDialog({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreatePayment(customerId);

  function handleSubmit(data: PaymentInput) {
    mutate(data, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="rounded-none">
          <Wallet className="h-4 w-4" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <PaymentForm customerId={customerId} onSubmit={handleSubmit} isPending={isPending} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
