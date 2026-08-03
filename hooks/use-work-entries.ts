"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { WorkEntryInput } from "@/lib/validations/work-entry";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body as T;
}

export function useCreateWorkEntry(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkEntryInput) =>
      fetchJson("/api/work-entries", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Work entry added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateWorkEntry(customerId: string, entryId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetchJson(`/api/work-entries/${entryId}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Work entry updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteWorkEntry(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => fetchJson(`/api/work-entries/${entryId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Work entry deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
