"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PaymentInput } from "@/lib/validations/payment";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body as T;
}

export function useCreatePayment(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentInput) =>
      fetchJson("/api/payments", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Payment recorded");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePayment(customerId: string, paymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      fetchJson(`/api/payments/${paymentId}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Payment updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePayment(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => fetchJson(`/api/payments/${paymentId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Payment deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
