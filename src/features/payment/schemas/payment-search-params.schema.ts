import { z } from "zod";
import { PaymentStatus } from "../types/enums-payments";

export const paymentSearchParamsSchema = z.object({
  search: z.string().trim().default(""),
  status: z.nativeEnum(PaymentStatus).optional(),
  paymentConfigId: z
    .union([
      z.string().transform((val) => {
        const num = parseInt(val, 10);
        return isNaN(num) || num <= 0 ? undefined : num;
      }),
      z.number().positive(),
    ])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "amount", "status", "updatedAt"])
    .default("createdAt"),
  sortOrder: z.enum(["ASC", "DESC"]).default("DESC"),
  page: z
    .union([
      z.string().transform((val) => Math.max(1, parseInt(val, 10) || 1)),
      z.number().min(1),
    ])
    .default(1),
  limit: z
    .union([
      z
        .string()
        .transform((val) =>
          Math.min(100, Math.max(1, parseInt(val, 10) || 20))
        ),
      z.number().min(1).max(100),
    ])
    .default(20),
});

export type PaymentSearchParams = z.infer<typeof paymentSearchParamsSchema>;
