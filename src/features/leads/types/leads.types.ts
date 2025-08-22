import { PaginationMeta } from '@/features/shared/types/api.types';

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface CreateLeadRequest {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface ListLeadsRequest {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface ListLeadsResponse extends PaginationMeta {
  items: Lead[];
}

export interface DownloadLeadsRequest {
  startDate?: string;
  endDate?: string;
}