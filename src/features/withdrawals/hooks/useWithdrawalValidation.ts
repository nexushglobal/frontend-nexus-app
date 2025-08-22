import { useQuery } from '@tanstack/react-query';
import { WithdrawalService } from '../services/withdrawalService';

export const useWithdrawalValidation = () => {
  return useQuery({
    queryKey: ['withdrawal-validation'],
    queryFn: () => WithdrawalService.validateWithdrawal(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};