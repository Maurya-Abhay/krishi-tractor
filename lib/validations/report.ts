import { z } from "zod";

export const reportRangeSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date",
    path: ["endDate"],
  });

export type ReportRangeInput = z.infer<typeof reportRangeSchema>;

export const loginSchema = z.object({
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
