'use client';

import { useQuery } from '@tanstack/react-query';
import { RankService } from '../services/rank.service';

export const useCurrentRank = () => {
  return useQuery({
    queryKey: ['current-rank'],
    queryFn: () => RankService.getCurrentRank(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};