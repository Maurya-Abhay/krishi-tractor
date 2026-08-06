import { NextRequest, NextResponse } from "next/server";
import { withApiHandler, ApiError } from "@/lib/api-handler";
import { reportRangeSchema } from "@/lib/validations/report";
import { getBackupReport } from "@/lib/data/reports";

export const GET = withApiHandler(async (req: NextRequest) => {
  const parsed = reportRangeSchema.safeParse({
    startDate: req.nextUrl.searchParams.get("startDate"),
    endDate: req.nextUrl.searchParams.get("endDate"),
  });

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0]?.message ?? "Invalid date range");
  }

  const report = await getBackupReport(parsed.data.startDate, parsed.data.endDate);
  return NextResponse.json({ report });
});
