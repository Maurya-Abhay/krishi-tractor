"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { ServiceUnit } from "@prisma/client";
import { workEntrySchema, type WorkEntryInput } from "@/lib/validations/work-entry";
import { calculateWorkEntryTotal, formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServices } from "@/hooks/use-services";

type ServiceOption = { id: string; name: string; unit: ServiceUnit; defaultRate: string };

export function WorkEntryForm({
  customerId,
  defaultValues,
  onSubmit,
  isPending,
}: {
  customerId: string;
  defaultValues?: Partial<WorkEntryInput>;
  onSubmit: (data: WorkEntryInput) => void;
  isPending?: boolean;
}) {
  const { data: servicesData } = useServices();
  const services: ServiceOption[] = servicesData?.services ?? [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<WorkEntryInput>({
    resolver: zodResolver(workEntrySchema),
    defaultValues: {
      customerId,
      date: new Date(),
      ...defaultValues,
    },
  });

  const selectedServiceId = watch("serviceId");
  const katha = watch("katha");
  const hours = watch("hours");
  const minutes = watch("minutes");

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const preview = useMemo(() => {
    if (!selectedService) return null;
    return calculateWorkEntryTotal({
      unit: selectedService.unit,
      rate: Number(selectedService.defaultRate),
      katha,
      hours,
      minutes,
    });
  }, [selectedService, katha, hours, minutes]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Service</Label>
        <Controller
          control={control}
          name="serviceId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {formatCurrency(Number(s.defaultRate))}
                    {s.unit === "KATHA" ? "/katha" : "/hr"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceId && <p className="text-sm text-destructive">{errors.serviceId.message}</p>}
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

      {selectedService?.unit === ServiceUnit.KATHA && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="katha">Katha</Label>
          <Input id="katha" type="number" step="0.01" placeholder="e.g. 5" {...register("katha")} />
          {errors.katha && <p className="text-sm text-destructive">{errors.katha.message}</p>}
        </div>
      )}

      {selectedService?.unit === ServiceUnit.HOUR && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hours">Hours</Label>
            <Input id="hours" type="number" min={0} max={23} {...register("hours")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="minutes">Minutes</Label>
            <Input id="minutes" type="number" min={0} max={59} {...register("minutes")} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" placeholder="Any additional detail" {...register("note")} />
      </div>

      {preview && (
        <div className="rounded-lg bg-secondary p-3 text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-semibold">{formatCurrency(preview.total)}</span>
        </div>
      )}

      <Button type="submit" size="lg" className="mt-2" disabled={isPending || !selectedService}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Work Entry
      </Button>
    </form>
  );
}
