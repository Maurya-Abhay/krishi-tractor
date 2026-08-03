import { NextRequest, NextResponse } from "next/server";
import { withApiHandler, ApiError } from "@/lib/api-handler";
import { reportRangeSchema } from "@/lib/validations/report";
import { getCustomerReport } from "@/lib/data/reports";

export const GET = withApiHandler(async (req: NextRequest, { params }) => {
  const parsed = reportRangeSchema.safeParse({
    startDate: req.nextUrl.searchParams.get("startDate"),
    endDate: req.nextUrl.searchParams.get("endDate"),
  });

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0]?.message ?? "Invalid date range");
  }

  const report = await getCustomerReport(
    params.customerId,
    parsed.data.startDate,
    parsed.data.endDate
  );

  if (!report.customer) throw new ApiError(404, "Customer not found");

  return NextResponse.json({ report });
});
