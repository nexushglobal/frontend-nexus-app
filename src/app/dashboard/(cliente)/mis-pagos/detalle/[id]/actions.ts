"use server";

import { httpClient } from "@/lib/api/http-client";
import { ActionResponse } from "@/types/user.types";

export interface PaymentDetailResponse {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentMethod: "VOUCHER" | "POINTS" | "PAYMENT_GATEWAY";
  operationCode: string | null;
  bankName: string | null;
  operationDate: string | null;
  ticketNumber: string | null;
  rejectionReason: string | null;
  reviewedByEmail: string | null;
  reviewedAt: string | null;
  isArchived: boolean;
  relatedEntityType: string;
  relatedEntityId: string;
  metadata: Record<string, any>;
  externalReference: string | null;
  gatewayTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
  paymentConfig: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  items: Array<{
    id: number;
    itemType: string;
    url: string | null;
    pointsTransactionId: string | null;
    amount: number;
    bankName: string | null;
    transactionDate: string;
  }>;
}

const PAYMENT_DETAIL_CACHE_TAG = "payment-detail";

export async function getPaymentDetail(
  paymentId: string
): Promise<ActionResponse<PaymentDetailResponse>> {
  try {
    const response = await httpClient<PaymentDetailResponse>(
      `/api/user/payments/${paymentId}`,
      {
        method: "GET",
        next: {
          tags: [`${PAYMENT_DETAIL_CACHE_TAG}-${paymentId}`],
          revalidate: 300,
        },
      }
    );

    return {
      success: response.success,
      message: response.message,
      data: response.data,
      errors: response.errors,
    };
  } catch (error: any) {
    console.error("Error fetching payment detail:", error);
    return {
      success: false,
      message: "Error al obtener el detalle del pago",
      data: null,
      errors: error,
    };
  }
}
