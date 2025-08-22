import { api } from '@/features/shared/services/api';
import {
  CreateWithdrawalRequest,
  RejectWithdrawalRequest,
  WithdrawalAdminResponse,
  WithdrawalClientResponse,
  WithdrawalDetail,
  WithdrawalValidationResponse,
} from '../types/withdrawals.types';

export class WithdrawalService {
  static async getAdminWithdrawals(
    params: Record<string, string | number | boolean | undefined | null>, // status, startDate, endDate, name ,email
  ): Promise<WithdrawalAdminResponse> {
    return api.get<WithdrawalAdminResponse>('/api/withdrawals', { params });
  }

  static async getClientWithdrawals(
    params: Record<string, string | number | boolean | undefined | null>, // status, startDate, endDate, name ,email
  ): Promise<WithdrawalClientResponse> {
    return api.get<WithdrawalClientResponse>('/api/withdrawals/clients/list', {
      params,
    });
  }

  // Get withdrawal detail by ID
  static async getWithdrawalDetail(id: number): Promise<WithdrawalDetail> {
    return api.get<WithdrawalDetail>(`/api/withdrawals/${id}`);
  }

  // Create a new withdrawal
  static async createWithdrawal(
    data: CreateWithdrawalRequest,
  ): Promise<WithdrawalDetail> {
    return api.post<WithdrawalDetail>('/api/withdrawals', data);
  }

  // Approve a withdrawal
  static async approveWithdrawal(id: number): Promise<WithdrawalDetail> {
    return api.post<WithdrawalDetail>(`/api/withdrawals/${id}/approve`);
  }

  // Reject a withdrawal
  static async rejectWithdrawal(
    id: number,
    data: RejectWithdrawalRequest,
  ): Promise<WithdrawalDetail> {
    return api.post<WithdrawalDetail>(`/api/withdrawals/${id}/reject`, data);
  }

  // Validate withdrawal eligibility
  static async validateWithdrawal(): Promise<WithdrawalValidationResponse> {
    return api.get<WithdrawalValidationResponse>(
      '/api/withdrawals/point/info/validate',
    );
  }
}
