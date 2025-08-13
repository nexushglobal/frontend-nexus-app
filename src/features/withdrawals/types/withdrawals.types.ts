import { PaginationMeta } from '@/features/shared/types/api.types';

export interface Withdrawal {
  id: number;
  amount: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  createdAt: string;
  reviewedAt?: string;
  bankName: string;
  accountNumber: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  reviewedBy?: {
    id: number;
    name: string;
    email: string;
  };
  metadata: Record<string, any>;
}

export interface WithdrawalResponse {
  items: Withdrawal[];
}

export interface WithdrawalAdminResponse extends PaginationMeta {
  items: Withdrawal[];
}
