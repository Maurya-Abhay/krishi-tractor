import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withApiHandler, parseJson } from "@/lib/api-handler";

const paymentEditSchema = z.object({
  amount: z.coerce.number().positive().max(10_000_000),
  date: z.coerce.date(),
  note: z.string().trim().max(255).optional().or(z.literal("")),
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }) => {
  const data = await parseJson(req, paymentEditSchema);

  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: { amount: data.amount, date: data.date, note: data.note || null },
  });

  return NextResponse.json({ payment });
});

export const DELETE = withApiHandler(async (_req, { params }) => {
  await prisma.payment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
});
