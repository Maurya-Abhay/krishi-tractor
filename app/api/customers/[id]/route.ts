import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations/customer";
import { withApiHandler, parseJson, ApiError } from "@/lib/api-handler";
import { getCustomerById, getCustomerSummary, getCustomerHistory } from "@/lib/data/customers";

export const GET = withApiHandler(async (_req, { params }) => {
  const customer = await getCustomerById(params.id);
  if (!customer) throw new ApiError(404, "Customer not found");

  const [summary, history] = await Promise.all([
    getCustomerSummary(params.id),
    getCustomerHistory(params.id),
  ]);

  return NextResponse.json({ customer, summary, ...history });
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }) => {
  const data = await parseJson(req, customerSchema);

  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone || null,
    },
  });

  return NextResponse.json({ customer });
});

export const DELETE = withApiHandler(async (_req, { params }) => {
  // Cascade delete removes associated work entries and payments too
  // (see onDelete: Cascade in schema.prisma) — this is intentional since
  // a customer record with no history has no reason to exist independently.
  await prisma.customer.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
});
