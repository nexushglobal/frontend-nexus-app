"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  PaginatedPaymentsResponse,
  PaymentTableMeta,
} from "@/types/payments/payments.types";
import { revalidatePath, revalidateTag } from "next/cache";

const PAYMENTS_CACHE_TAG = "user-payments";

export async function getUserPayments(
  params?: Record<string, unknown>
): Promise<{
  data: any[];
  meta: PaymentTableMeta;
  paymentConfigs: any[];
}> {
  try {
    const response = await httpClient<PaginatedPaymentsResponse["data"]>(
      "/api/user/payments",
      {
        params,
        next: {
          tags: [PAYMENTS_CACHE_TAG],
          revalidate: 300,
        },
      }
    );

    const meta: PaymentTableMeta = {
      totalItems: response.data.pagination.total,
      itemsPerPage: response.data.pagination.limit,
      totalPages: response.data.pagination.totalPages,
      currentPage: response.data.pagination.page,
    };

    return {
      data: response.data.items,
      meta,
      paymentConfigs: response.data.meta.activePaymentConfigs,
    };
  } catch (error) {
    console.error("Error al obtener pagos del usuario:", error);
    throw error;
  }
}

export async function revalidatePayments() {
  revalidateTag(PAYMENTS_CACHE_TAG);
  revalidatePath("/dashboard/mis-pagos");
}
