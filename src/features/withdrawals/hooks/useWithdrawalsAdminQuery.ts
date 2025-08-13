import { useQuery } from '@tanstack/react-query';
import { WithdrawalService } from '../services/withdrawalService';
import { WithdrawalAdminResponse } from '../types/withdrawals.types';

export function useAdminWithdrawals(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<WithdrawalAdminResponse>({
    queryKey: ['admin-withdrawals', params],
    queryFn: () => WithdrawalService.getAdminWithdrawals(params),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}
