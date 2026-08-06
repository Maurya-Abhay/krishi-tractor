import { NextRequest, NextResponse } from "next/server";
import { withApiHandler, ApiError } from "@/lib/api-handler";
import { reportRangeSchema } from "@/lib/validations/report";
import { getBackupReport } from "@/lib/data/reports";
import { generateBackupReportPdf } from "@/lib/pdf";

export const GET = withApiHandler(async (req: NextRequest) => {
  const parsed = reportRangeSchema.safeParse({
    startDate: req.nextUrl.searchParams.get("startDate"),
    endDate: req.nextUrl.searchParams.get("endDate"),
  });

  if (!parsed.success) {
    throw new ApiError(400, parsed.error.errors[0]?.message ?? "Invalid date range");
  }

  const report = await getBackupReport(parsed.data.startDate, parsed.data.endDate);
  const pdfBytes = await generateBackupReportPdf(report);
  const fileName = `backup_summary_${parsed.data.startDate.toISOString().slice(0, 10)}_${parsed.data.endDate
    .toISOString()
    .slice(0, 10)}.pdf`;

  const downloadParam = req.nextUrl.searchParams.get("download");
  const shouldDownload = downloadParam === null ? true : downloadParam !== "false";

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${fileName}"`,
    },
  });
});
