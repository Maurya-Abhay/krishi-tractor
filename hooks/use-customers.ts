"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CustomerInput } from "@/lib/validations/customer";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body as T;
}

/** Debounces a fast-changing value so we don't fire a request on every keystroke. */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function useCustomers(search?: string, initialData?: { customers: any[] }) {
  return useQuery({
    queryKey: ["customers", search ?? ""],
    queryFn: () =>
      fetchJson<{ customers: any[] }>(
        `/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`
      ),
    // Keeps the previous list visible while the new search resolves,
    // instead of flashing a loading state on every keystroke.
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    initialData: search ? undefined : initialData,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetchJson<{ customer: any; summary: any; workEntries: any[]; payments: any[] }>(
      `/api/customers/${id}`
    ),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomerInput) =>
      fetchJson("/api/customers", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomerInput) =>
      fetchJson(`/api/customers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      toast.success("Customer updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson(`/api/customers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
