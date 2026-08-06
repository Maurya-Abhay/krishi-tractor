import { BackupReportGenerator } from "@/components/reports/backup-report-generator";

export const dynamic = "force-dynamic";

export default function BackupReportPage() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Backup Summary Report</h1>
        <p className="text-xs text-muted-foreground">
          Generate a consolidated PDF for all customers with total work, received payments, pending balance,
          and a per-customer status list.
        </p>
      </div>
      <BackupReportGenerator />
    </div>
  );
}
