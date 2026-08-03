import { PrismaClient } from "@prisma/client";

function normalizeEnvString(value?: string) {
  if (!value) return value;
  const trimmed = value.trim();
  if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function getDatabaseUrl() {
  const rawDatabaseUrl = normalizeEnvString(process.env.DATABASE_URL);
  if (!rawDatabaseUrl) {
    return rawDatabaseUrl;
  }

  if (rawDatabaseUrl.includes("sslmode=")) {
    return rawDatabaseUrl;
  }

  try {
    const url = new URL(rawDatabaseUrl);
    const host = url.host;
    const isSupabase = host.includes("supabase.co");

    if (!isSupabase) {
      return rawDatabaseUrl;
    }

    url.searchParams.set("sslmode", "require");
    process.env.PGSSLMODE = "require";
    return url.toString();
  } catch (error) {
    const quotedStripped = rawDatabaseUrl.replace(/^['"]|['"]$/g, "");
    const isSupabase = quotedStripped.includes("supabase.co");
    if (isSupabase && !quotedStripped.includes("sslmode=")) {
      const separator = quotedStripped.includes("?") ? "&" : "?";
      const result = `${quotedStripped}${separator}sslmode=require`;
      process.env.PGSSLMODE = "require";
      return result;
    }

    console.warn("Failed to normalize DATABASE_URL for SSL; using original value.", error);
    return rawDatabaseUrl;
  }
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
