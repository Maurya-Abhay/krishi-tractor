import "server-only";
import { prisma } from "@/lib/prisma";
import { deriveBalance, round2 } from "@/lib/calculations";

export type BackupReportCustomer = {
  id: string;
  name: string;
  workTotal: number;
  paidTotal: number;
  pending: number;
};

export type BackupReport = {
  customers: BackupReportCustomer[];
  customerCount: number;
  totalWork: number;
  totalPaid: number;
  pendingBalance: number;
  range: { startDate: Date; endDate: Date };
};

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

export async function getBackupReport(startDate: Date, endDate: Date): Promise<BackupReport> {
  const inclusiveEnd = new Date(endDate);
  inclusiveEnd.setHours(23, 59, 59, 999);

  const customers = await prisma.customer.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const [workTotals, paidTotals] = await Promise.all([
    prisma.workEntry.groupBy({
      by: ["customerId"],
      where: { date: { gte: startDate, lte: inclusiveEnd } },
      _sum: { total: true },
    }),
    prisma.payment.groupBy({
      by: ["customerId"],
      where: { date: { gte: startDate, lte: inclusiveEnd } },
      _sum: { amount: true },
    }),
  ]);

  const workMap = new Map(workTotals.map((entry) => [entry.customerId, Number(entry._sum.total ?? 0)]));
  const paidMap = new Map(paidTotals.map((entry) => [entry.customerId, Number(entry._sum.amount ?? 0)]));

  const backupCustomers = customers.map((customer) => {
    const workTotal = round2(workMap.get(customer.id) ?? 0);
    const paidTotal = round2(paidMap.get(customer.id) ?? 0);
    const { pending } = deriveBalance({ workTotal, paidTotal });
    return {
      id: customer.id,
      name: customer.name,
      workTotal,
      paidTotal,
      pending,
    };
  });

  const totalWork = round2(backupCustomers.reduce((sum, item) => sum + item.workTotal, 0));
  const totalPaid = round2(backupCustomers.reduce((sum, item) => sum + item.paidTotal, 0));
  const pendingBalance = round2(totalWork - totalPaid);

  return {
    customers: backupCustomers,
    customerCount: backupCustomers.length,
    totalWork,
    totalPaid,
    pendingBalance,
    range: { startDate, endDate },
  };
}
