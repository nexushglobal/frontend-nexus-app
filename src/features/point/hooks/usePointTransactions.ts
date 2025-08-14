'use client';

import { useQuery } from '@tanstack/react-query';
import { PointService } from '../services/point.service';
import type { PointTransactionListResponse } from '../types/points.types';

export function useUserTransactions(
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<PointTransactionListResponse>({
    queryKey: ['user-transactions', params],
    queryFn: () => PointService.getUserTransactions(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    enabled: !!params, // Solo ejecutar si hay parámetros
  });
}
