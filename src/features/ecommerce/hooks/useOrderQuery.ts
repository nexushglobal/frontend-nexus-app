import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../service/orderService';
import type {
  OrderAdminDetailResponse,
  OrderAdminResponse,
} from '../types/order.type';

export function useAdminOrders(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<OrderAdminResponse>({
    queryKey: ['admin-orders', params],
    queryFn: () => OrderService.getAdminOrders(params),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false,
  });
}

export function useAdminOrderDetails(orderId: number) {
  return useQuery<OrderAdminDetailResponse>({
    queryKey: ['admin-order-details', orderId],
    queryFn: () => OrderService.getAdminOrderDetails(orderId),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false,
    enabled: !!orderId,
  });
}
