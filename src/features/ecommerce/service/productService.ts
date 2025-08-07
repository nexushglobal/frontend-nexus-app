import { api } from '@/features/shared/services/api';
import type { ProductAdminResponse } from '../types/product.type';

export class ProductService {
  // Servicios para admin
  static async getAdminProducts(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<ProductAdminResponse> {
    return api.get<ProductAdminResponse>('/api/products', { params });
  }
}
