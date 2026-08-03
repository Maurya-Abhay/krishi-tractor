import "server-only";
import { prisma } from "@/lib/prisma";
import { round2 } from "@/lib/calculations";

export async function getCustomerReport(customerId: string, startDate: Date, endDate: Date) {
  // Make endDate inclusive of the whole day.
  const inclusiveEnd = new Date(endDate);
  inclusiveEnd.setHours(23, 59, 59, 999);

  const [customer, workEntries, payments] = await Promise.all([
    prisma.customer.findUnique({ where: { id: customerId } }),
    prisma.workEntry.findMany({
      where: { customerId, date: { gte: startDate, lte: inclusiveEnd } },
      include: { service: { select: { name: true, unit: true } } },
      orderBy: { date: "desc" },
    }),
    prisma.payment.findMany({
      where: { customerId, date: { gte: startDate, lte: inclusiveEnd } },
      orderBy: { date: "desc" },
    }),
  ]);

  const totalWork = round2(workEntries.reduce((sum, w) => sum + Number(w.total), 0));
  const totalPaid = round2(payments.reduce((sum, p) => sum + Number(p.amount), 0));

  return {
    customer,
    workEntries,
    payments,
    totalWork,
    totalPaid,
    pendingBalance: round2(totalWork - totalPaid),
    range: { startDate, endDate },
  };
}
