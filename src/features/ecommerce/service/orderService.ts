import { api } from '@/features/shared/services/api';
import {
  OrderAdminDetailResponse,
  OrderAdminResponse,
  OrderClientDetailResponse,
  OrderClientResponse,
} from '../types/order.type';

export class OrderService {
  static async getAdminOrders(
    params: Record<string, string | number | boolean | undefined | null>,
  ): Promise<OrderAdminResponse> {
    return api.get<OrderAdminResponse>('/api/orders/admin', { params });
  }

  static async getAdminOrderDetails(
    orderId: number,
  ): Promise<OrderAdminDetailResponse> {
    return api.get<OrderAdminDetailResponse>(`/api/orders/admin/${orderId}`);
  }

  static async getClientOrders(
    params: Record<string, string | number | boolean | undefined | null>, //status startDate term endDate
  ): Promise<OrderClientResponse> {
    return api.get<OrderClientResponse>('/api/orders/my-orders', { params });
  }

  static async getClientOrderDetails(
    orderId: number,
  ): Promise<OrderClientDetailResponse> {
    return api.get<OrderClientDetailResponse>(
      `/api/orders/my-orders/${orderId}`,
    );
  }
}
