import { api } from "@/features/shared/services/api";
import { Sale, SaleDetail } from "../types/sale.types";

export class SaleService {
  static async getSales(): Promise<Sale[]> {
    return api.get<Sale[]>("/api/unilevel/external/sales");
  }

  static async getSaleDetail(saleId: string): Promise<SaleDetail> {
    return api.get<SaleDetail>(`/api/unilevel/external/sales/${saleId}`);
  }
}
