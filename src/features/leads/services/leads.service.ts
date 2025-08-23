import { api } from '@/features/shared/services/api';
import {
  CreateLeadRequest,
  Lead,
  ListLeadsResponse,
} from '../types/leads.types';

export class LeadsService {
  static async createLead(data: CreateLeadRequest): Promise<Lead> {
    return api.post<Lead>('/leads', data);
  }

  static async listLeads(params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ListLeadsResponse> {
    return api.get<ListLeadsResponse>('/api/leads', { params });
  }

  static async downloadLeads(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await api.downloadFile('/api/leads/download', {
      params,
    });
    return response;
  }
}
