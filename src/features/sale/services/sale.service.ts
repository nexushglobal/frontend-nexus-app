import { api } from "@/features/shared/services/api";
import { SaleDetail } from "../types/sale.types";
import { SaleResponse } from "../types/sale-response.types";

export class SaleService {
  static async getSales(): Promise<SaleResponse> {
    return api.get<SaleResponse>("/api/unilevel/external/sales");
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetail> {
    return api.get<SaleDetail>(`/api/unilevel/external/sales/${saleId}`);
  }
}
