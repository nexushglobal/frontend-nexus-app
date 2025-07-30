export enum PointTransactionType {
  BINARY_COMMISSION = 'BINARY_COMMISSION',
  DIRECT_BONUS = 'DIRECT_BONUS',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum PointTransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export interface Transaction {
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
  createdAt: string;
  updatedAt: string;
}
