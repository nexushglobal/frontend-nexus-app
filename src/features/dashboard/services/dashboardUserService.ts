import { api } from '@/features/shared/services/api';
import { DashboardUserInfoResponse } from '../types/dashboard-user-info.types';

export const dashboardUserService = {
  async getDashboardUserInfo(): Promise<DashboardUserInfoResponse> {
    return await api.get<DashboardUserInfoResponse>('/api/dashboard/user/info');
  },
};
