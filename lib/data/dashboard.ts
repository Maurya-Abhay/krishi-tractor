import "server-only";
import { prisma } from "@/lib/prisma";
import { round2 } from "@/lib/calculations";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfTomorrow(): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
}

export async function getDashboardStats() {
  const todayStart = startOfToday();
  const tomorrowStart = startOfTomorrow();
  try {
    const [
      totalCustomers,
      todayWorkCount,
      todayWorkSum,
      todayPaymentAgg,
      totalWorkAgg,
      totalPaidAgg,
      recentWork,
      recentPayments,
    ] = await Promise.all([
      prisma.customer.count(),
      // use count() for a simple integer count
      prisma.workEntry.count({ where: { date: { gte: todayStart, lt: tomorrowStart } } }),
      // sum of today's work totals
      prisma.workEntry.aggregate({
        where: { date: { gte: todayStart, lt: tomorrowStart } },
        _sum: { total: true },
      }),
      prisma.payment.aggregate({
        where: { date: { gte: todayStart, lt: tomorrowStart } },
        _sum: { amount: true },
      }),
      prisma.workEntry.aggregate({ _sum: { total: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.workEntry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } }, service: { select: { name: true } } },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } } },
      }),
    ]);

    const totalWork = round2(Number(totalWorkAgg._sum.total ?? 0));
    const totalPaid = round2(Number(totalPaidAgg._sum.amount ?? 0));

    return {
      totalCustomers,
      todayWorkCount,
      todayWorkAmount: round2(Number(todayWorkSum._sum.total ?? 0)),
      todayCollection: round2(Number(todayPaymentAgg._sum.amount ?? 0)),
      pendingAmount: round2(totalWork - totalPaid),
      receivedAmount: totalPaid,
      recentWork,
      recentPayments,
    };
  } catch (err) {
    // In case any DB call fails, return safe defaults so the dashboard page doesn't crash.
    console.error("getDashboardStats error:", err);
    return {
      totalCustomers: 0,
      todayWorkCount: 0,
      todayWorkAmount: 0,
      todayCollection: 0,
      pendingAmount: 0,
      receivedAmount: 0,
      recentWork: [],
      recentPayments: [],
    };
  }

  return {
    totalCustomers,
    todayWorkCount: todayWorkAgg._count,
    todayWorkAmount: round2(Number(todayWorkAgg._sum.total ?? 0)),
    todayCollection: round2(Number(todayPaymentAgg._sum.amount ?? 0)),
    pendingAmount: round2(totalWork - totalPaid),
    receivedAmount: totalPaid,
    recentWork,
    recentPayments,
  };
}
