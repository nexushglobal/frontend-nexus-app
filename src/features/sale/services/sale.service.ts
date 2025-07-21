import { api } from "@/features/shared/services/api";
import { Sale, SaleDetail } from "../types/sale.types";

export class SaleService {
  private static readonly ENDPOINTS = {
    SALES: "/api/unilevel/external/sales",
    SALE_DETAIL: "/api/unilevel/external/sales",
  } as const;

  static async getSales(): Promise<Sale[]> {
    return api.get<Sale[]>(this.ENDPOINTS.SALES);
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetail> {
    return api.get<SaleDetail>(`${this.ENDPOINTS.SALE_DETAIL}/${saleId}`);
  }
}
