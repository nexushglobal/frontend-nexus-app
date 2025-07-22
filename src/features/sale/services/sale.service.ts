import { api } from "@/features/shared/services/api";
import { SaleDetailResponse, SaleResponse } from "../types/sale-response.types";

export class SaleService {
  static async getSales(): Promise<SaleResponse> {
    return api.get<SaleResponse>("/api/unilevel/external/sales");
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetailResponse> {
    return api.get<SaleDetailResponse>(
      `/api/unilevel/external/sales/${saleId}`
    );
  }
}
