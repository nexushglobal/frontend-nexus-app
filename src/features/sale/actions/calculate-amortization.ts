"use server";

import { api } from "@features/shared/services/api";

import { CalulateAmortizationPayload } from "../types/sale.types";
import { AmortizationResponse } from "../types/sale-response.types";

export async function calculateAmortization(
  data: CalulateAmortizationPayload
): Promise<AmortizationResponse> {
  try {
    return await api.post<AmortizationResponse>(
      "/api/unilevel/external/calculate/amortization",
      {
        body: data,
      }
    );
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    throw Error;
  }
}
