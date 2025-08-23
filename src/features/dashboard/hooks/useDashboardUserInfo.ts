import { useQuery } from '@tanstack/react-query';
import { dashboardUserService } from '../services/dashboardUserService';

export const useDashboardUserInfo = () => {
  return useQuery({
    queryKey: ['dashboard-user-info'],
    queryFn: dashboardUserService.getDashboardUserInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};