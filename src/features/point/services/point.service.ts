import { api } from '@/features/shared/services/api';
import {
  PointLotTransactionListResponse,
  PointTransactionDetailResponse,
  PointTransactionListResponse,
} from '../types/points.types';

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

  static async getUserTransactionsDetail(
    id: number,
    params?: Record<string, string | number | boolean | undefined | null>, // solo paginacion limit y page
  ): Promise<PointTransactionDetailResponse> {
    return await api.get<PointTransactionDetailResponse>(
      '/api/points-transaction/transaction-details/' + id,
      {
        params: params,
      },
    );
  }

  static async getUserLotTransactions(
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<PointLotTransactionListResponse> {
    return await api.get<PointLotTransactionListResponse>(
      '/api/points-lots-transaction/transaction',
      {
        params: params,
      },
    );
  }
}
