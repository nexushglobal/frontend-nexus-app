"use server";

import { api } from "@/features/shared/services/api";

import {
  PAYMENT_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/payments.constants";
import {
  PaginatedPaymentsResponse,
  Payment,
  PaymentConfig,
  PaymentTableMeta,
} from "../types/payments.type";

export async function getUserPayments(
  params?: Record<string, unknown>
): Promise<{
  data: Payment[];
  meta: PaymentTableMeta;
  paymentConfigs: PaymentConfig[];
}> {
  try {
    const response = await api.get<PaginatedPaymentsResponse["data"]>(
      "/api/user/payments",
      {
        params,
        next: {
          tags: [PAYMENT_CACHE_TAGS.USER_PAYMENTS],
          revalidate: REVALIDATE_TIME,
        },
      }
    );

    const meta: PaymentTableMeta = {
      totalItems: response.pagination.total,
      itemsPerPage: response.pagination.limit,
      totalPages: response.pagination.totalPages,
      currentPage: response.pagination.page,
    };

    return {
      data: response.items,
      meta,
      paymentConfigs: response.meta.activePaymentConfigs,
    };
  } catch (error) {
    console.error("Error al obtener pagos del usuario:", error);
    throw new Error("No se pudieron cargar los pagos");
  }
}
