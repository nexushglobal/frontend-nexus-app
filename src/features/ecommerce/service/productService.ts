import { api } from '@/features/shared/services/api';
import type {
  ProductAdminResponse,
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../types/product.type';

export class ProductService {
  // Servicios para admin
  static async getAdminProducts(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<ProductAdminResponse> {
    return api.get<ProductAdminResponse>('/api/products', { params });
  }

  static async getHistoryProductStock(
    id: number,
    params: Record<string, string | number | boolean | undefined | null>, //solo tiene params de paginación limit y page
  ): Promise<StockProductHistoryResponse> {
    return api.get<StockProductHistoryResponse>(
      `/api/product-stock-history/${id}/stock`,
      { params },
    );
  }

  static async getProductAdmin(id: number): Promise<ProductDetailAdmin> {
    return api.get<ProductDetailAdmin>(`/api/products/${id}`);
  }

  static async getClientProducts(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<ProductAdminResponse> {
    return api.get<ProductAdminResponse>('/api/products/clients/list', {
      params,
    });
  }
}
