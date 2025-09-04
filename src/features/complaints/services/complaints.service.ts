import { api } from '@/features/shared/services/api';
import {
  Complaint,
  ComplaintFilters,
  ComplaintsResponse,
  UpdateComplaintAttendedRequest,
} from '../types/complaints.types';

export class ComplaintsService {
  static async getComplaints(
    filters: ComplaintFilters = {},
  ): Promise<ComplaintsResponse> {
    const params: Record<string, any> = {};

    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.attended !== undefined) params.attended = filters.attended;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return api.get<ComplaintsResponse>('/api/app/complaints', { params });
  }

  static async updateComplaintAttended(
    id: number,
    data: UpdateComplaintAttendedRequest,
  ): Promise<Complaint> {
    return api.post<Complaint>(`/api/app/complaints/${id}/attend`, data);
  }
}
