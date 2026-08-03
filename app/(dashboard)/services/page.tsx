import { Wrench } from "lucide-react";
import { listServices } from "@/lib/data/services";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/calculations";
import { ServiceRateDialog } from "@/components/services/service-rate-dialog";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Services</h1>
        <p className="text-xs text-muted-foreground">
          Update rates anytime — past work entries always keep the rate they were created with.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="rounded-none shadow-2xl bg-card dark:bg-card overflow-hidden">
            <CardContent className="flex flex-col gap-2 p-2">
              <div className="flex items-start justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-secondary">
                  <Wrench className="h-4 w-4 text-primary" />
                </div>
                <Badge>{service.unit === "KATHA" ? "Per Katha" : "Per Hour"}</Badge>
              </div>
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  {formatCurrency(Number(service.defaultRate))}
                </p>
              </div>
              <ServiceRateDialog
                service={{
                  id: service.id,
                  name: service.name,
                  defaultRate: service.defaultRate.toString(),
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
