import { ServiceUnit } from "@prisma/client";

/**
 * Converts hour + minute into a decimal hour value.
 * e.g. 2 hours 30 minutes -> 2.5
 */
export function toDecimalHour(hours: number, minutes: number): number {
  return Math.round((hours + minutes / 60) * 100) / 100;
}

/**
 * Computes the total for a work entry given its service unit and inputs.
 * This is the ONLY place total calculation logic should exist.
 * Both the server (route handler, authoritative) and the client
 * (live form preview) call this exact function.
 */
export function calculateWorkEntryTotal(params: {
  unit: ServiceUnit;
  rate: number;
  katha?: number | null;
  hours?: number | null;
  minutes?: number | null;
}): { total: number; decimalHour: number | null } {
  const { unit, rate, katha, hours, minutes } = params;

  if (unit === ServiceUnit.KATHA) {
    const k = katha ?? 0;
    return { total: round2(k * rate), decimalHour: null };
  }

  // HOUR unit (Harvest Machine)
  const h = hours ?? 0;
  const m = minutes ?? 0;
  const decimalHour = toDecimalHour(h, m);
  return { total: round2(decimalHour * rate), decimalHour };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Formats a number as Indian Rupees, e.g. ₹1,234.50 */
export function formatCurrency(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

/** Formats a date consistently across the whole app, e.g. 02 Aug 2026 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Derives a customer's financial summary purely from work entries and
 * payments — never from a stored balance field, to avoid drift/races.
 */
export function deriveBalance(params: {
  workTotal: number;
  paidTotal: number;
}): { pending: number } {
  return { pending: round2(params.workTotal - params.paidTotal) };
}
