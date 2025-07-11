import {
  paymentSearchParamsSchema,
  type PaymentSearchParams,
} from "../schemas/payment-search-params.schema";

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
    console.warn("Payment search params validation failed:", error);
    return paymentSearchParamsSchema.parse({});
  }
}
