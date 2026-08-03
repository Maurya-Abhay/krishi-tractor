"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { customerSchema, type CustomerInput } from "@/lib/validations/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomerForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Save Customer",
}: {
  defaultValues?: Partial<CustomerInput>;
  onSubmit: (data: CustomerInput) => void;
  isPending?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Customer Name</Label>
        <Input id="name" placeholder="e.g. Ramesh Kumar" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="Village, District" {...register("address")} />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" type="tel" inputMode="numeric" placeholder="10-digit number" {...register("phone")} />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>
      <Button type="submit" size="lg" className="mt-2" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
