import { useQuery } from '@tanstack/react-query';
import { WithdrawalService } from '../services/withdrawalService';
import { WithdrawalDetail } from '../types/withdrawals.types';

export function useWithdrawalDetail(id: number) {
  return useQuery<WithdrawalDetail>({
    queryKey: ['withdrawal-detail', id],
    queryFn: () => WithdrawalService.getWithdrawalDetail(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}