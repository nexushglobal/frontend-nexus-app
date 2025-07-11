"use server";

import { api } from "@/features/shared/services/api";
import {
  PAYMENT_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/payments.constants";
import {
  PaymentAdminDetailResponse,
  PaymentUserDetailResponse,
} from "../types/response-payment";

export async function getPaymentDetailAction(paymentId: string) {
  try {
    const response = await api.get<PaymentUserDetailResponse>(
      `/api/user/payments/${paymentId}`,
      {
        next: {
          tags: [`${PAYMENT_CACHE_TAGS.PAYMENT_DETAIL}-${paymentId}`],
          revalidate: REVALIDATE_TIME,
        },
      }
    );
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener el detalle del pago",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPaymentDetailAdminAction(paymentId: string) {
  try {
    const response = await api.get<PaymentAdminDetailResponse>(
      `/api/admin/payments/${paymentId}`,
      {
        next: {
          tags: [`${PAYMENT_CACHE_TAGS.ADMIN_PAYMENT_DETAIL}-${paymentId}`],
          revalidate: REVALIDATE_TIME,
        },
      }
    );
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener el detalle del pago",
      data: null,
      errors: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
