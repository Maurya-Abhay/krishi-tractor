import { z } from "zod";

export const paymentSchema = z.object({
  customerId: z.string().cuid(),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(10_000_000, "Amount seems unrealistically high"),
  date: z.coerce.date(),
  note: z.string().trim().max(255).optional().or(z.literal("")),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
