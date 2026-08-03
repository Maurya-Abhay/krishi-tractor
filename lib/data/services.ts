import "server-only";
import { prisma } from "@/lib/prisma";

export async function listServices() {
  return prisma.service.findMany({ orderBy: { name: "asc" } });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}
