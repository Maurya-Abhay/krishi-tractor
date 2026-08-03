import { z } from "zod";

// Services are seeded (Sukha Jutai, Lewahi, Harvest Machine) and their
// name/unit never change from the UI — only the rate is editable.
export const serviceRateUpdateSchema = z.object({
  defaultRate: z.coerce
    .number({ invalid_type_error: "Rate must be a number" })
    .positive("Rate must be greater than 0")
    .max(1_000_000, "Rate seems unrealistically high"),
});

export type ServiceRateUpdateInput = z.infer<typeof serviceRateUpdateSchema>;
