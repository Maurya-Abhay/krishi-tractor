import { PrismaClient } from "@prisma/client";
import { parse } from "url";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return databaseUrl;
  }

  if (databaseUrl.includes("sslmode=")) {
    return databaseUrl;
  }

  const parsed = parse(databaseUrl, true);
  const host = parsed.host ?? "";
  const isSupabase = host.includes("supabase.co");

  if (!isSupabase) {
    return databaseUrl;
  }

  const separator = databaseUrl.includes("?") ? "&" : "?";
  return `${databaseUrl}${separator}sslmode=require`;
}

const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

// Prevents creating a new PrismaClient on every hot-reload in development,
// which would otherwise exhaust the database connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
