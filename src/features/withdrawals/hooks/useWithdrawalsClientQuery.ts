import { useQuery } from '@tanstack/react-query';
import { WithdrawalService } from '../services/withdrawalService';
import { WithdrawalClientResponse } from '../types/withdrawals.types';

export function useClientWithdrawals(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<WithdrawalClientResponse>({
    queryKey: ['client-withdrawals', params],
    queryFn: () => WithdrawalService.getClientWithdrawals(params),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}
