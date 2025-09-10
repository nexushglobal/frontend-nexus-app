import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/teamtService';
import { DirectTeamResponse } from '../types/team.types';

interface UseReferralsParams {
  page?: number;
  limit?: number;
  sortBy?: 'volume' | 'lots';
  sortOrder?: 'asc' | 'desc';
}

export function useReferrals(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<DirectTeamResponse>({
    queryKey: ['referrals', params],
    queryFn: () => UserService.getUsersDirects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
