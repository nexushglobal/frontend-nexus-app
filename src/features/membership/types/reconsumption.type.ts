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
  useCard: boolean;
  canReconsume: boolean;
  autoRenewal: boolean;
  status:
    | 'PENDING'
    | 'ACTIVE'
    | 'INACTIVE'
    | 'EXPIRED'
    | 'DELETED'
    | 'SUSPENDED';
  reconsumptionAmount: number;
  isPointLot: boolean;
  startDate: string; //like '2025-07-14';
  endDate: string; //like '2025-08-13';
}

export interface ReconsumtionResponse {
  infoReconsumptions: InfoReconsumptions;
  membership: MembershipReconsumption;
}
