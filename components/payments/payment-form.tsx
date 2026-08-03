"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { paymentSchema, type PaymentInput } from "@/lib/validations/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PaymentForm({
  customerId,
  defaultValues,
  onSubmit,
  isPending,
}: {
  customerId: string;
  defaultValues?: Partial<PaymentInput>;
  onSubmit: (data: PaymentInput) => void;
  isPending?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerId,
      date: new Date(),
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input id="amount" type="number" step="0.01" placeholder="e.g. 5000" {...register("amount")} />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          {...register("date")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" placeholder="e.g. Cash, advance" {...register("note")} />
      </div>
      <Button type="submit" size="lg" className="mt-2" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Payment
      </Button>
    </form>
  );
}
