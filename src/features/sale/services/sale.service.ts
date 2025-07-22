import { api } from "@/features/shared/services/api";
import { SaleResponse } from "../types/sale-response.types";
import { SaleDetail } from "../types/sale.types";

export class SaleService {
  static async getSales(): Promise<SaleResponse> {
    return api.get<SaleResponse>("/api/unilevel/external/sales");
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetail> {
    const response = api.get<SaleDetail>(
      `/api/unilevel/external/sales/${saleId}`
    );

    console.log(response);

    return response;
  }
}
