import { PaginationMeta } from '@/features/shared/types/api.types';

export interface PointTransactionBase {
  id: number;
  type: 'BINARY_COMMISSION' | 'DIRECT_BONUS' | 'WITHDRAWAL';
  amount: number;
  pendingAmount: number;
  withdrawnAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  isArchived: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string; //like "2025-08-11T09:00:00.115Z"
  updatedAt: string; //like "2025-08-11T09:00:00.115Z"
}

export interface PointTransactionListResponse extends PaginationMeta {
  items: PointTransactionBase[];
}

export interface PointUserResponse {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
}
