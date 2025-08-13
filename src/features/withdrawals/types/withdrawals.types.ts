import { PaginationMeta } from '@/features/shared/types/api.types';

export interface WithdrawalBase {
  id: number;
  amount: number;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  createdAt: string;
  reviewedAt?: string;
  bankName: string;
  accountNumber: string;
  metadata: Record<string, any>;
}

export interface WithdrawalAdmin extends WithdrawalBase {
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
}

export interface WithdrawalClient extends WithdrawalBase {
  userId: number;
  userEmail: string;
  userName: string;
  rejectionReason?: null | string;
  reviewedById: number;
  reviewedByEmail: string;
  cci: string;
  isArchived: boolean;
}

export interface WithdrawalAdminResponse extends PaginationMeta {
  items: WithdrawalAdmin[];
}

export interface WithdrawalClientResponse extends PaginationMeta {
  items: WithdrawalClient[];
}
