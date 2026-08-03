"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import {
  serviceRateUpdateSchema,
  type ServiceRateUpdateInput,
} from "@/lib/validations/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUpdateServiceRate } from "@/hooks/use-services";

export function ServiceRateDialog({ service }: { service: { id: string; name: string; defaultRate: string } }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateServiceRate(service.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceRateUpdateInput>({
    resolver: zodResolver(serviceRateUpdateSchema),
    defaultValues: { defaultRate: Number(service.defaultRate) },
  });

  function onSubmit(data: ServiceRateUpdateInput) {
    mutate(data, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
          Update Rate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Rate — {service.name}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              This changes the rate for future work entries only. Past records are never affected.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="defaultRate">New Rate (₹)</Label>
              <Input
                id="defaultRate"
                type="number"
                step="0.01"
                {...register("defaultRate")}
              />
              {errors.defaultRate && (
                <p className="text-sm text-destructive">{errors.defaultRate.message}</p>
              )}
            </div>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Rate
            </Button>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
