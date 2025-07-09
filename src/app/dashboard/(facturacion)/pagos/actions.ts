"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  AdminPaymentResponse,
  AdminPaymentsResponse,
  AdminPaymentTableMeta,
  PaymentMetadataResponse,
} from "@/types/admin-payments.types";
import { revalidatePath, revalidateTag } from "next/cache";

const ADMIN_PAYMENTS_CACHE_TAG = "admin-payments";

export async function getAdminPayments(
  params?: Record<string, unknown>
): Promise<{
  data: AdminPaymentResponse[];
  meta: AdminPaymentTableMeta;
}> {
  try {
    const response = await httpClient<AdminPaymentsResponse["data"]>(
      "/api/admin/payments",
      {
        params,
        next: {
          tags: [ADMIN_PAYMENTS_CACHE_TAG],
          revalidate: 60, // 1 minuto para datos más frescos en admin
        },
      }
    );
    console.log("Response from admin payments:", response.data);

    const meta: AdminPaymentTableMeta = {
      totalItems: response.pagination.total,
      itemsPerPage: response.pagination.limit,
      totalPages: response.pagination.totalPages,
      currentPage: response.pagination.page,
    };

    return {
      data: response.payments,
      meta,
    };
  } catch (error) {
    console.error("Error al obtener pagos de admin:", error);
    throw error;
  }
}

export async function getPaymentMetadata() {
  try {
    const response = await httpClient<PaymentMetadataResponse["data"]>(
      "/api/admin/payments/metadata",
      {
        next: {
          tags: [ADMIN_PAYMENTS_CACHE_TAG],
          revalidate: 300, // 5 minutos para metadatos
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error al obtener metadatos de pagos:", error);
    throw error;
  }
}

export async function revalidateAdminPayments() {
  revalidateTag(ADMIN_PAYMENTS_CACHE_TAG);
  revalidatePath("/dashboard/pagos");
}
