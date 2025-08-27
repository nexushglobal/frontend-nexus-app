import { api } from '@/features/shared/services/api';
import {
  AttendComplaintDto,
  AttendComplaintResponse,
  Complaint,
  CreateComplaintDto,
  GetComplaintsParams,
} from '../types/complaint.types';

export const complaintService = {
  /**
   * Crear una nueva queja/reclamo
   */
  async create(data: CreateComplaintDto): Promise<Complaint> {
    return api.postPublic<Complaint>('api/app/complaints', data);
  },

  /**
   * Obtener listado de quejas/reclamos con paginación y filtros
   */
  async getComplaints(
    params: GetComplaintsParams = {},
  ): Promise<AttendComplaintResponse> {
    return api.get<AttendComplaintResponse>('api/app/complaints', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.attended !== undefined && { attended: params.attended }),
      },
    });
  },

  /**
   * Marcar una queja/reclamo como atendida
   */
  async attendComplaint(
    id: number,
    data: AttendComplaintDto,
  ): Promise<Complaint> {
    return api.patch<Complaint>(`api/app/complaints/${id}/attend`, data);
  },
};
