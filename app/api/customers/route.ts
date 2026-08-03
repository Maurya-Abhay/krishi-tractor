import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validations/customer";
import { withApiHandler, parseJson } from "@/lib/api-handler";
import { listCustomers } from "@/lib/data/customers";

export const GET = withApiHandler(async (req: NextRequest) => {
  const search = req.nextUrl.searchParams.get("search") ?? undefined;
  const customers = await listCustomers(search);
  return NextResponse.json({ customers });
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const data = await parseJson(req, customerSchema);

  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone || null,
    },
  });

  return NextResponse.json({ customer }, { status: 201 });
});
