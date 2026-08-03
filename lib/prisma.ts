import { PrismaClient } from "@prisma/client";

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return databaseUrl;
  }

  if (databaseUrl.includes("sslmode=")) {
    return databaseUrl;
  }

  try {
    const url = new URL(databaseUrl);
    const host = url.host;
    const isSupabase = host.includes("supabase.co");

    if (!isSupabase) {
      return databaseUrl;
    }

    url.searchParams.set("sslmode", "require");
    return url.toString();
  } catch (error) {
    console.warn("Failed to normalize DATABASE_URL for SSL; using original value.", error);
    return databaseUrl;
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
