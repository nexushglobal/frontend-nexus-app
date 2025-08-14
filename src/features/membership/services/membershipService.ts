import { api } from '@/features/shared/services/api';
import {
  MembershipDetailResponse,
  MembershipHistoryResponse,
} from '../types/membership.types';
import { ReconsumtionResponse } from '../types/reconsumption.type';

export class MembershipService {
  static async getUserMembershipHistory(
    params: Record<string, string | number | boolean | undefined | null>, // page and limit
  ): Promise<MembershipHistoryResponse> {
    return api.get<MembershipHistoryResponse>('/api/membership/history', {
      params,
    });
  }

  static async getMembershipDetail(): Promise<MembershipDetailResponse> {
    return api.get<MembershipDetailResponse>(`/api/membership/detail`);
  }

  static async getReconsumptionDetail(
    params: Record<string, string | number | boolean | undefined | null>, // page and limit
  ): Promise<ReconsumtionResponse> {
    return api.get<ReconsumtionResponse>(
      `/api/membership-reconsumption/with-membership`,
      { params },
    );
  }
}
