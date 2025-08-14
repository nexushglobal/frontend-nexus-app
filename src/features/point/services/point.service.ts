import { api } from '@/features/shared/services/api';
import { PointTransactionListResponse } from '../types/points.types';

export class PointService {
  static async getUserTransactions(
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<PointTransactionListResponse> {
    return await api.get<PointTransactionListResponse>(
      '/api/points-transaction/transaction',
      {
        params: params,
      },
    );
  }
}
