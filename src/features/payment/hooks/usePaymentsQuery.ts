import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '../services/paymentService';
import type { PaymentFiltersRequest } from '../types/request-payments';

export const paymentKeys = {
  all: ['payments'] as const,
  admin: () => [...paymentKeys.all, 'admin'] as const,
  adminList: (filters: PaymentFiltersRequest) =>
    [...paymentKeys.admin(), 'list', filters] as const,
  user: () => [...paymentKeys.all, 'user'] as const,
  userList: (filters: PaymentFiltersRequest) =>
    [...paymentKeys.user(), 'list', filters] as const,
};

export function useAdminPayments(
  filters: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery({
    queryKey: paymentKeys.adminList(filters),
    queryFn: () => PaymentService.getAdminPayments(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
  });
}

export function useUserPayments(
  filters: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery({
    queryKey: paymentKeys.userList(filters),
    queryFn: () => PaymentService.getUserPayments(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
  });
}
