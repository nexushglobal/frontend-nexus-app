import { ApiPaginationMeta } from '@/features/shared/types/api.types';
import { WithdrawalStatus } from './enums-withdrawals';

export interface WithdrawalBase {
  id: number;
  amount: number;
  status: WithdrawalStatus;
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

export interface WithdrawalAdminResponse {
  pagination: ApiPaginationMeta;
  items: WithdrawalAdmin[];
}

export interface WithdrawalClientResponse {
  pagination: ApiPaginationMeta;
  items: WithdrawalClient[];
}

// Types for withdrawal detail
export interface PaymentInfo {
  paymentId: string;
  operationCode: string | null;
  ticketNumber: string | null;
  paymentMethod: string;
  amount: number;
}

export interface WithdrawalPoint {
  id: number;
  amountUsed: number;
  pointsTransactionId: string;
  pointsAmount: number;
  metadata: Record<string, any>;
  createdAt: string;
  points: {
    transactionId: string;
    amount: number;
  };
  paymentsInfo: PaymentInfo[];
}

export interface WithdrawalDetailUser {
  id: string;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    cci: string;
  };
}

export interface WithdrawalDetailReviewedBy {
  id: string;
  email: string;
}

export interface WithdrawalDetail {
  id: number;
  amount: number;
  status: WithdrawalStatus;
  createdAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  isArchived: boolean;
  metadata: Record<string, any>;
  bankName: string;
  accountNumber: string;
  cci: string;
  pdfUrl: string | null;
  user: WithdrawalDetailUser;
  reviewedBy: WithdrawalDetailReviewedBy | null;
  withdrawalPoints: WithdrawalPoint[];
}

// Request/Response types for API operations
export interface CreateWithdrawalRequest {
  amount: number;
  userId: string;
  userName: string;
  userEmail: string;
  bankName: string;
  accountNumber: string;
  cci: string;
}

export interface ApproveWithdrawalRequest {
  // No additional data needed, just the ID in the URL
}

export interface RejectWithdrawalRequest {
  rejectionReason: string;
}

// Withdrawal validation types
export interface WithdrawalUserInfo {
  userId: string;
  userName: string;
  userEmail: string;
  documentType: string;
  documentNumber: string;
  ruc: string;
  razonSocial: string;
  address: string;
  bankName: string;
  accountNumber: string;
  cci: string;
  phone: string;
}

export interface WithdrawalValidationResponse {
  infoUser: WithdrawalUserInfo;
  canWithdraw: boolean;
  availablePoints: number;
  req?: string[];
}
