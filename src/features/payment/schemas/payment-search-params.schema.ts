import { z } from "zod";
import { PaymentStatus } from "../types/enums-payments";

/**
 * Schema de validación para los search params de payments
 */
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

// ===================================================================
// PARA SERVER COMPONENTS
// ===================================================================

/**
 * Función server-side para validar searchParams en Server Components
 */
export function validatePaymentSearchParams(
  searchParams?: Record<string, string | string[] | undefined> | null
): PaymentSearchParams {
  try {
    const flatParams = Object.entries(searchParams || {}).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value[0];
        } else if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | undefined>
    );

    return paymentSearchParamsSchema.parse(flatParams);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Payment search params validation failed:", error);
    }
    return paymentSearchParamsSchema.parse({});
  }
}

// ===================================================================
// PARA CLIENT COMPONENTS
// ===================================================================

import { useMemo } from "react";

/**
 * Hook para Client Components que valida searchParams
 * Usa los mismos tipos que la función server-side
 */
export function usePaymentSearchParams(
  searchParams?: Record<string, string | string[] | undefined> | null
): PaymentSearchParams {
  return useMemo(() => {
    return validatePaymentSearchParams(searchParams);
  }, [searchParams]);
}

// ===================================================================
// VALORES POR DEFECTO Y UTILITIES
// ===================================================================

export const PAYMENT_SEARCH_DEFAULTS: PaymentSearchParams = {
  search: "",
  status: undefined,
  paymentConfigId: undefined,
  startDate: undefined,
  endDate: undefined,
  sortBy: "createdAt",
  sortOrder: "DESC",
  page: 1,
  limit: 20,
};

export const paymentSearchParamsUtils = {
  toQueryString: (params: Partial<PaymentSearchParams>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== "" &&
        value !== PAYMENT_SEARCH_DEFAULTS[key as keyof PaymentSearchParams]
      ) {
        searchParams.set(key, String(value));
      }
    });

    return searchParams.toString();
  },

  areEqual: (a: PaymentSearchParams, b: PaymentSearchParams): boolean => {
    return JSON.stringify(a) === JSON.stringify(b);
  },

  getDifferences: (
    params: PaymentSearchParams
  ): Partial<PaymentSearchParams> => {
    const differences: Partial<PaymentSearchParams> = {};

    Object.entries(params).forEach(([key, value]) => {
      const defaultValue =
        PAYMENT_SEARCH_DEFAULTS[key as keyof PaymentSearchParams];
      if (value !== defaultValue) {
        differences[key as keyof PaymentSearchParams] = value as any;
      }
    });

    return differences;
  },
};
