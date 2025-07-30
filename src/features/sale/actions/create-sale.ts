"use server";

import { api } from "@features/shared/services/api";
import { revalidateTag } from "next/cache";

import { ProcessPaymentDto } from "../types/sale-request";
import {
  CreateSaleResponse,
  PaymentResponse,
} from "../types/sale-response.types";
import { CreateSalePayload } from "../types/sale.types";

const SALES_VENDOR_CACHE_TAG = "sales-vendor";

export async function createSale(data: CreateSalePayload) {
  try {
    const response = await api.post<CreateSaleResponse>(
      "/api/unilevel/external/sales",
      data
    );
    revalidateTag(SALES_VENDOR_CACHE_TAG);

    return { success: true, data: response };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear liner",
    };
  }
}

export async function createPayment(
  id: string,
  data: ProcessPaymentDto
): Promise<PaymentResponse> {
  try {
    const formData = new FormData();
    formData.append("payments", JSON.stringify(data.payments));
    data.files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<PaymentResponse>(
      `/api/unilevel/external/payments/sale/${id}`,
      formData,
      {
        isFormData: true,
        skipJsonStringify: true
      }
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    }
    throw new Error("Error al crear el pago");
  }
}
