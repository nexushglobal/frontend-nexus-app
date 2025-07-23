import { api } from "@/features/shared/services/api";
import { SaleResponse } from "../types/sale-response.types";
import { SaleDetail } from "../types/sale.types";

export class SaleService {
  static async getSales(): Promise<SaleResponse> {
    return await api.get<SaleResponse>("/api/unilevel/external/sales");
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetail> {
    const endpoint = `/api/unilevel/external/sales/${saleId}`;
    try {
      const response = await api.get<SaleDetail>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
