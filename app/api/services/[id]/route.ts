import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serviceRateUpdateSchema } from "@/lib/validations/service";
import { withApiHandler, parseJson, ApiError } from "@/lib/api-handler";

export const PATCH = withApiHandler(async (req: NextRequest, { params }) => {
  const data = await parseJson(req, serviceRateUpdateSchema);

  const existing = await prisma.service.findUnique({ where: { id: params.id } });
  if (!existing) throw new ApiError(404, "Service not found");

  // IMPORTANT: this only updates the template rate used for future work
  // entries. Every existing WorkEntry keeps the rate it was created with —
  // see prisma/schema.prisma comment on WorkEntry.rate.
  const service = await prisma.service.update({
    where: { id: params.id },
    data: { defaultRate: data.defaultRate },
  });

  return NextResponse.json({ service });
});
