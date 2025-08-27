import { useQuery } from '@tanstack/react-query';
import { complaintService } from '../services/complaint.service';
import { GetComplaintsParams } from '../types/complaint.types';

export function useComplaints(params: GetComplaintsParams = {}) {
  return useQuery({
    queryKey: ['complaints', params],
    queryFn: () => complaintService.getComplaints(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}