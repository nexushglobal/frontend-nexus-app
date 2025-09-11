import { ApiPaginationMeta } from '@/features/shared/types/api.types';

export enum DocumentType {
  DNI = 'DNI',
  CE = 'CE',
}

export enum ItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}

export enum ComplaintType {
  COMPLAINT = 'COMPLAINT',
  CLAIM = 'CLAIM',
}

export interface CreateComplaintDto {
  fullName: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  email: string;
  parentGuardian?: string;
  itemType: ItemType;
  claimAmount: number;
  description: string;
  detail: string;
  complaintType: ComplaintType;
  order?: string;
}

export interface Complaint {
  id: number;
  fullName: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  email: string;
  parentGuardian?: string;
  itemType: ItemType;
  claimAmount: number;
  description: string;
  detail: string;
  complaintType: ComplaintType;
  order?: string;
  attended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetComplaintsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  attended?: boolean;
}

export interface AttendComplaintDto {
  attended: boolean;
}
export interface AttendComplaintResponse {
  items: Complaint[];
  pagination: ApiPaginationMeta;
}
