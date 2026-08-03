import "server-only";
import { prisma } from "@/lib/prisma";
import { deriveBalance, round2 } from "@/lib/calculations";

export async function listCustomers(search?: string) {
  const customers = await prisma.customer.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  });

  // Derive balances in bulk via aggregate queries rather than N+1 look-ups.
  const customerIds = customers.map((customer) => customer.id);

  const [workTotals, paidTotals] = await Promise.all([
    prisma.workEntry.groupBy({
      by: ["customerId"],
      where: { customerId: { in: customerIds } },
      orderBy: { customerId: "asc" },
      _sum: { total: true },
    }),
    prisma.payment.groupBy({
      by: ["customerId"],
      where: { customerId: { in: customerIds } },
      orderBy: { customerId: "asc" },
      _sum: { amount: true },
    }),
  ]);

  const workMap = new Map(workTotals.map((w) => [w.customerId, Number(w._sum.total ?? 0)]));
  const paidMap = new Map(paidTotals.map((p) => [p.customerId, Number(p._sum.amount ?? 0)]));

  return customers.map((c) => {
    const workTotal = workMap.get(c.id) ?? 0;
    const paidTotal = paidMap.get(c.id) ?? 0;
    return {
      ...c,
      workTotal,
      paidTotal,
      pending: deriveBalance({ workTotal, paidTotal }).pending,
    };
  });
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({ where: { id } });
}

export async function getCustomerSummary(id: string) {
  const [workAgg, paidAgg] = await Promise.all([
    prisma.workEntry.aggregate({ where: { customerId: id }, _sum: { total: true } }),
    prisma.payment.aggregate({ where: { customerId: id }, _sum: { amount: true } }),
  ]);

  const workTotal = round2(Number(workAgg._sum.total ?? 0));
  const paidTotal = round2(Number(paidAgg._sum.amount ?? 0));

  return { workTotal, paidTotal, pending: deriveBalance({ workTotal, paidTotal }).pending };
}

export async function getCustomerHistory(id: string) {
  const [workEntries, payments] = await Promise.all([
    prisma.workEntry.findMany({
      where: { customerId: id },
      include: { service: { select: { name: true, unit: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.payment.findMany({
      where: { customerId: id },
      orderBy: { date: "desc" },
    }),
  ]);

  return { workEntries, payments };
}
