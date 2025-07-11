import { PaginationMeta } from "@/features/shared/types/api.types";
import { PaymentMethod, PaymentStatus } from "./enums-payments";

// ---- BASE TYPES ----
export interface PaymentConfig {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  documentNumber: string;
  phone: string;
}

export interface PaymentBase {
  id: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  paymentConfig: PaymentConfig;
  operationCode?: string | null;
  bankName?: string | null;
  operationDate?: string | null;
  ticketNumber?: string | null;
}

// ---- PAYMENTS USER ----
export interface PaymentUser extends PaymentBase {}

export interface PaymentUserResponse extends PaginationMeta {
  items: PaymentUser[];
  meta: {
    activePaymentConfigs: PaymentConfig[];
  };
}

export interface PaymentUserDetailResponse extends PaymentBase {
  rejectionReason: string | null;
  reviewedByEmail: string | null;
  reviewedAt: string | null;
  isArchived: boolean;
  relatedEntityType: string;
  relatedEntityId: string;
  metadata: Record<string, any>;
  externalReference: string | null;
  gatewayTransactionId: string | null;
  items: PaymentItem[];
}
export interface PaymentItem {
  id: number;
  itemType: string;
  url: string | null;
  pointsTransactionId: string | null;
  amount: number;
  bankName: string | null;
  transactionDate: string;
}

// ---- PAYMENTS ADMIN ----
export interface PaymentAdmin extends PaymentBase {
  user: UserInfo;
  operationCode?: string | null;
  ticketNumber?: string | null;
}

export interface PaymentAdminResponse extends PaginationMeta {
  items: PaymentAdmin[];
  meta: {
    activePaymentConfigs: PaymentConfig[];
  };
}

export interface PaymentAdminDetailResponse extends PaymentBase {
  user: UserInfo;
  rejectionReason: string | null;
  reviewedByEmail: string | null;
  reviewedAt: string | null;
  isArchived: boolean;
  relatedEntityType: string;
  relatedEntityId: string;
  metadata: Record<string, any>;
  externalReference: string | null;
  gatewayTransactionId: string | null;
  items: PaymentItem[];
}
