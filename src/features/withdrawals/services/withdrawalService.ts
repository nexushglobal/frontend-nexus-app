import { api } from '@/features/shared/services/api';
import { WithdrawalAdminResponse } from '../types/withdrawals.types';

export class WithdrawalService {
  static async getAdminWithdrawals(
    params: Record<string, string | number | boolean | undefined | null>, // status, startDate, endDate, name ,email
  ): Promise<WithdrawalAdminResponse> {
    return api.get<WithdrawalAdminResponse>('/api/withdrawals', { params });
  }
}
