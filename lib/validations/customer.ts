import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  address: z
    .string()
    .trim()
    .min(2, "Address must be at least 2 characters")
    .max(255, "Address is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export const customerIdSchema = z.object({
  id: z.string().cuid(),
});
