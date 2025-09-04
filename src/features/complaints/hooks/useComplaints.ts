import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ComplaintsService } from '../services/complaints.service';
import { ComplaintFilters, UpdateComplaintAttendedRequest } from '../types/complaints.types';

export const useComplaints = (filters: ComplaintFilters = {}) => {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => ComplaintsService.getComplaints(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateComplaintAttended = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateComplaintAttendedRequest;
    }) => ComplaintsService.updateComplaintAttended(id, data),
    onSuccess: (_, { data }) => {
      toast.success(
        `Reclamo marcado como ${data.attended ? 'atendido' : 'pendiente'}`
      );
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || 'Error al actualizar el estado del reclamo'
      );
    },
  });
};