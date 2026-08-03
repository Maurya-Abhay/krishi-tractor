import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentSchema } from "@/lib/validations/payment";
import { withApiHandler, parseJson, ApiError } from "@/lib/api-handler";

export const POST = withApiHandler(async (req: NextRequest) => {
  const data = await parseJson(req, paymentSchema);

  const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
  if (!customer) throw new ApiError(404, "Customer not found");

  // No balance field to update here by design — the customer's pending
  // amount is always derived on read (see lib/data/customers.ts), so a
  // payment record is simply inserted and the next read reflects it.
  const payment = await prisma.payment.create({
    data: {
      customerId: data.customerId,
      amount: data.amount,
      date: data.date,
      note: data.note || null,
    },
  });

  return NextResponse.json({ payment }, { status: 201 });
});
