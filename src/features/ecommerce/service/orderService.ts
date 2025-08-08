import { api } from '@/features/shared/services/api';
import { OrderAdminResponse } from '../types/order.type';

export class OrderService {
  static async getAdminOrders(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<OrderAdminResponse> {
    return api.get<OrderAdminResponse>('/api/orders/admin', { params });
  }
}
