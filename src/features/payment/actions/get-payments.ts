"use server";

import { api } from "@/features/shared/services/api";

import {
  PAYMENT_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/payments.constants";
import {
  PaymentAdminResponse,
  PaymentUserResponse,
} from "../types/response-payment";

export async function getUserPaymentsAction(
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

export async function getAdminPaymentsAction(
  params?: Record<string, string | number | boolean | undefined | null>
) {
  try {
    const response = await api.get<PaymentAdminResponse>(
      "/api/admin/payments",
      {
        params,
        next: {
          tags: [PAYMENT_CACHE_TAGS.ADMIN_PAYMENTS],
          revalidate: REVALIDATE_TIME,
        },
      }
    );

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
