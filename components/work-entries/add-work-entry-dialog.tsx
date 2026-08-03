"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkEntryForm } from "@/components/work-entries/work-entry-form";
import { useCreateWorkEntry } from "@/hooks/use-work-entries";
import type { WorkEntryInput } from "@/lib/validations/work-entry";

export function AddWorkEntryDialog({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateWorkEntry(customerId);

  function handleSubmit(data: WorkEntryInput) {
    mutate(data, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-none">
          <Plus className="h-4 w-4" />
          Add Work
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Work Entry</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <WorkEntryForm customerId={customerId} onSubmit={handleSubmit} isPending={isPending} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
