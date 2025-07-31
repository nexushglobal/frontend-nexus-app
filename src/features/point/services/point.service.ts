import {
  DetailTransactionResponse,
  TransactionResponse,
  UserPointsResponse,
} from '@/features/point/types/points-response';
import { api } from '@/features/shared/services/api';

export class PointService {
  static async getUserPoints(): Promise<UserPointsResponse> {
    try {
      return await api.get<UserPointsResponse>('/api/point/user-points');
    } catch (error) {
      if (error instanceof Error)
        console.error('Error fetching user points:', error.message);
      throw new Error('Failed to fetch user points');
    }
  }

  static async getUserTransactions(
    params?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<TransactionResponse> {
    try {
      return await api.get<TransactionResponse>(
        '/api/points-transaction/transaction',
        {
          params: params,
        },
      );
    } catch (error) {
      if (error instanceof Error)
        console.error('Error fetching user transactions:', error.message);
      throw new Error('Failed to fetch user transactions');
    }
  }

  static async getPointsTransactionById(
    id: number,
    params?:
      | Record<string, string | number | boolean | undefined | null>
      | undefined,
  ): Promise<DetailTransactionResponse> {
    try {
      return await api.get<DetailTransactionResponse>(
        `/api/points-transaction/transaction-details/${id}`,
        {
          params: params,
        },
      );
    } catch (error) {
      if (error instanceof Error)
        console.error('Error fetching user points:', error.message);
      throw new Error('Failed to fetch user points');
    }
  }
}
