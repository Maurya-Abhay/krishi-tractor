import { z } from "zod";

export const workEntrySchema = z
  .object({
    customerId: z.string().cuid(),
    serviceId: z.string().cuid(),
    date: z.coerce.date(),
    katha: z.coerce.number().positive().optional(),
    hours: z.coerce.number().int().min(0).max(23).optional(),
    minutes: z.coerce.number().int().min(0).max(59).optional(),
    note: z.string().trim().max(255).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      const hasKatha = data.katha !== undefined;
      const hasHours = data.hours !== undefined || data.minutes !== undefined;
      // Exactly one input mode must be provided — enforced again server-side
      // against the actual Service.unit in the route handler, since the
      // client only knows the unit it rendered, not the source of truth.
      return hasKatha !== hasHours;
    },
    { message: "Provide either Katha, or Hours/Minutes — not both, not neither." }
  );

export type WorkEntryInput = z.infer<typeof workEntrySchema>;

export const workEntryUpdateSchema = workEntrySchema;
