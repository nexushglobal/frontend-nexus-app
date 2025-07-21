"use server";

import { api } from "@features/shared/services/api";
import { revalidateTag } from "next/cache";

import { CreateSalePayload } from "../types/sale.types";
import { CreateSaleResponse } from "../types/sale-response.types";

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
    console.error("Error al crear la venta:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear liner",
    };
  }
}
