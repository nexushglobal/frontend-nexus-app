import { PaginationMeta } from '@/features/shared/types/api.types';

export interface ReconsumtionItem {
  id: number;
  amount: number;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
  periodDate: string; // like "2025-09-12"
  paymentReference: string | null;
  paymentDetails: Record<string, any> | null;
  notes: string;
  createdAt: string; // like "2025-06-16T14:20:00.191Z"
  updatedAt: string; // like "2025-06-16T14:20:00.191Z"
}

export interface InfoReconsumptions extends PaginationMeta {
  items: ReconsumtionItem[];
}

export interface MembershipReconsumption {
  typeReconsumption: 'POINTLOT' | 'PRODUCT' | 'SERVICE' | 'AUTOMATIC';
  useCard: boolean;
}

export interface ReconsumtionResponse {
  infoReconsumptions: InfoReconsumptions;
  canReconsume: boolean;
  autoRenewal: boolean;
  reconsumptionAmount: number;
  membership: MembershipReconsumption;
}
