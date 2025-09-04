import { useQuery } from '@tanstack/react-query';
import { ReportsService } from '../services/reports.service';

export const useActiveReports = () => {
  return useQuery({
    queryKey: ['reports', 'active'],
    queryFn: ReportsService.getActiveReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};