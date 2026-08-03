import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ServiceUnit } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withApiHandler, parseJson, ApiError } from "@/lib/api-handler";
import { calculateWorkEntryTotal } from "@/lib/calculations";

// Editing an entry may only correct the date, quantity, or note — never the
// rate or the service, since that would break the historical-record
// guarantee. To change the service/rate of a work entry, delete and re-add it.
const workEntryEditSchema = z.object({
  date: z.coerce.date(),
  katha: z.coerce.number().positive().optional(),
  hours: z.coerce.number().int().min(0).max(23).optional(),
  minutes: z.coerce.number().int().min(0).max(59).optional(),
  note: z.string().trim().max(255).optional().or(z.literal("")),
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }) => {
  const data = await parseJson(req, workEntryEditSchema);

  const existing = await prisma.workEntry.findUnique({
    where: { id: params.id },
    include: { service: true },
  });
  if (!existing) throw new ApiError(404, "Work entry not found");

  if (existing.service.unit === ServiceUnit.KATHA && data.katha === undefined) {
    throw new ApiError(400, "Katha is required for this service.");
  }
  if (
    existing.service.unit === ServiceUnit.HOUR &&
    data.hours === undefined &&
    data.minutes === undefined
  ) {
    throw new ApiError(400, "Hours/minutes are required for this service.");
  }

  // Recalculate using the entry's OWN stored rate — NOT the service's
  // current defaultRate — so correcting a typo never silently re-prices
  // the work at today's rate.
  const rate = Number(existing.rate);
  const { total, decimalHour } = calculateWorkEntryTotal({
    unit: existing.service.unit,
    rate,
    katha: data.katha,
    hours: data.hours,
    minutes: data.minutes,
  });

  const workEntry = await prisma.workEntry.update({
    where: { id: params.id },
    data: {
      date: data.date,
      katha: data.katha ?? null,
      hours: data.hours ?? null,
      minutes: data.minutes ?? null,
      decimalHour,
      total,
      note: data.note || null,
    },
    include: { service: true },
  });

  return NextResponse.json({ workEntry });
});

export const DELETE = withApiHandler(async (_req, { params }) => {
  await prisma.workEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
});
