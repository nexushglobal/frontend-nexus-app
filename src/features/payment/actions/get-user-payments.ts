"use server";

import { api } from "@/features/shared/services/api";

import {
  PAYMENT_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/payments.constants";
import { PaymentUserResponse } from "../types/response-payment";

export async function getUserPayments(
  params?: Record<string, string | number | boolean | undefined | null>
) {
  try {
    const response = await api.get<PaymentUserResponse>("/api/user/payments", {
      params,
      next: {
        tags: [PAYMENT_CACHE_TAGS.USER_PAYMENTS],
        revalidate: REVALIDATE_TIME,
      },
    });

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener los pagos del usuario",
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
