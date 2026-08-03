"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ServiceRateUpdateInput } from "@/lib/validations/service";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body as T;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => fetchJson<{ services: any[] }>("/api/services"),
  });
}

export function useUpdateServiceRate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceRateUpdateInput) =>
      fetchJson(`/api/services/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Rate updated. Past work entries are unaffected.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
