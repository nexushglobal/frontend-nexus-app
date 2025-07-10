"use server";

import { api } from "@/features/shared/services/api";
import {
  PAYMENT_CACHE_TAGS,
  REVALIDATE_TIME,
} from "../constants/payments.constants";
import { PaymentDetailResponse } from "../types/payments.type";

export interface GetPaymentDetailResponse {
  success: boolean;
  message: string;
  data: PaymentDetailResponse | null;
  errors: any;
}

export async function getPaymentDetail(
  paymentId: string
): Promise<GetPaymentDetailResponse> {
  // Validación server-side OBLIGATORIA
  if (!paymentId?.trim()) {
    return {
      success: false,
      message: "ID de pago requerido",
      data: null,
      errors: "Invalid payment ID",
    };
  }

  try {
    const response = await api.get<PaymentDetailResponse>(
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
      message: "Detalle del pago obtenido correctamente",
      data: response,
      errors: null,
    };
  } catch (error: any) {
    console.error("Error fetching payment detail:", error);
    return {
      success: false,
      message: "Error al obtener el detalle del pago",
      data: null,
      errors: error.message || "Unknown error",
    };
  }
}
