import { NextRequest, NextResponse } from "next/server";
import { ServiceUnit } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { workEntrySchema } from "@/lib/validations/work-entry";
import { withApiHandler, parseJson, ApiError } from "@/lib/api-handler";
import { calculateWorkEntryTotal } from "@/lib/calculations";

export const POST = withApiHandler(async (req: NextRequest) => {
  const data = await parseJson(req, workEntrySchema);

  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
  if (!service) throw new ApiError(404, "Service not found");

  // Server-side enforcement of which input mode is valid for this service —
  // the client only knows what it rendered; this is the authoritative check.
  if (service.unit === ServiceUnit.KATHA && data.katha === undefined) {
    throw new ApiError(400, "Katha is required for this service.");
  }
  if (service.unit === ServiceUnit.HOUR && data.hours === undefined && data.minutes === undefined) {
    throw new ApiError(400, "Hours/minutes are required for this service.");
  }

  const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
  if (!customer) throw new ApiError(404, "Customer not found");

  // The rate is ALWAYS taken from the service's current defaultRate at the
  // moment of creation, then stored on the WorkEntry itself. It is never
  // read from the client, and it never changes again after this point —
  // this is what makes historical records immutable when rates change later.
  const rate = Number(service.defaultRate);
  const { total, decimalHour } = calculateWorkEntryTotal({
    unit: service.unit,
    rate,
    katha: data.katha,
    hours: data.hours,
    minutes: data.minutes,
  });

  const workEntry = await prisma.workEntry.create({
    data: {
      customerId: data.customerId,
      serviceId: data.serviceId,
      date: data.date,
      rate,
      total,
      katha: data.katha ?? null,
      hours: data.hours ?? null,
      minutes: data.minutes ?? null,
      decimalHour,
      note: data.note || null,
    },
    include: { service: true },
  });

  return NextResponse.json({ workEntry }, { status: 201 });
});
