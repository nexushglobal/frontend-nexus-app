export type DocumentType = 'DNI' | 'CE';
export type ItemType = 'SERVICE' | 'PRODUCT';
export type ComplaintType = 'COMPLAINT' | 'CLAIM';

export interface Complaint {
  id: number;
  fullName: string;
  address: string;
  documentType: DocumentType;
  documentNumber: string;
  phone: string;
  email: string;
  parentGuardian: string;
  itemType: ItemType;
  claimAmount: string;
  description: string;
  detail: string;
  complaintType: ComplaintType;
  order: string;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintFilters {
  startDate?: string;
  endDate?: string;
  attended?: boolean;
  page?: number;
  limit?: number;
}

export interface ComplaintsResponse {
  items: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateComplaintAttendedRequest {
  attended: boolean;
}