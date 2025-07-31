import {
  PointTransactionStatus,
  PointTransactionType,
  Transaction,
} from './points.types';

export interface UserPointsResponse {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
  membershipPlan: {
    name: string;
  };
}
export interface TransactionResponse {
  items: Transaction[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface DetailTransactionResponse {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  type: PointTransactionType;
  amount: number;
  pendingAmount: number;
  withdrawnAmount: number;
  status: PointTransactionStatus;
  isArchived: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  listPayments: ListPayments;
}

export interface ListPayments {
  items: Item[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface Item {
  id: number;
  amount: number;
  paymentMethod: 'VOUCHER' | 'POINTS' | 'PAYMENT_GATEWAY';
  paymentReference: string;
  notes: string;
  createdAt: Date;
}
