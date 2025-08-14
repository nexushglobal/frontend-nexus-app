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

export interface PointLotTransactionBase {
  id: number;
  type: 'LOT_BINARY_COMMISSION' | 'LOT_DIRECT_BONUS' | 'LOT_WITHDRAWAL';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  amount: number;
  pendingAmount: number;
  withdrawnAmount: number;
  isArchived: boolean;
  createdAt: string; //like "2025-08-11T09:00:00.115Z"
  updatedAt: string; //like "2025-08-11T09:00:00.115Z"
}

export interface PointTransactionListResponse extends PaginationMeta {
  items: PointTransactionBase[];
}

export interface PointLotTransactionListResponse extends PaginationMeta {
  items: PointLotTransactionBase[];
}

export interface PointUserResponse {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
}

export interface PointLotUserResponse {
  availableLotPoints: number;
  totalEarnedLotPoints: number;
  totalWithdrawnLotPoints: number;
}

export interface PaymentItem {
  id: number;
  amount: number;
  paymentMethod: 'VOUCHER' | 'POINTS' | 'PAYMENT_GATEWAY';
  paymentReference: string;
  notes?: string;
  createdAt: string; // like "2025-08-11T09:00:00.115Z"
}

export interface PaymentList extends PaginationMeta {
  items?: PaymentItem[];
}
export interface PointTransactionDetailResponse extends PointTransactionBase {
  listPayments?: PaymentList;
}
