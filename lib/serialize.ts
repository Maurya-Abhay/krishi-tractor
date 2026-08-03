import type { Prisma } from "@prisma/client";

/**
 * Prisma hands back `Decimal` class instances and `Date` objects. React Server
 * Components can only pass *plain* values across the server→client boundary —
 * a `Decimal` throws "Only plain objects can be passed to Client Components".
 *
 * Every server→client prop in this app goes through `serialize()`, so client
 * components can assume: money is a `number`, dates are ISO `string`s. That
 * assumption is encoded in the `Serialized<T>` type, so the compiler enforces
 * it rather than leaving it to convention.
 */
export type Serialized<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;

/**
 * Duck-typed rather than `instanceof Prisma.Decimal` so this module never
 * pulls the Prisma runtime into a bundle. Decimal.js instances are the only
 * things in our data layer exposing both `toNumber` and `toFixed`.
 */
function isDecimal(value: object): value is Prisma.Decimal {
  return (
    typeof (value as { toNumber?: unknown }).toNumber === "function" &&
    typeof (value as { toFixed?: unknown }).toFixed === "function"
  );
}

export function serialize<T>(value: T): Serialized<T> {
  if (value === null || value === undefined) {
    return value as Serialized<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as Serialized<T>;
  }

  if (Array.isArray(value)) {
    return value.map(serialize) as Serialized<T>;
  }

  if (typeof value === "object") {
    if (isDecimal(value)) {
      return value.toNumber() as Serialized<T>;
    }

    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = serialize(nested);
    }
    return out as Serialized<T>;
  }

  return value as Serialized<T>;
}
