// src/types/admin-payments.types.ts
export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum PaymentMethod {
  VOUCHER = "VOUCHER",
  POINTS = "POINTS",
  PAYMENT_GATEWAY = "PAYMENT_GATEWAY",
}

export interface AdminPaymentResponse {
  id: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  operationCode?: string;
  ticketNumber?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedByEmail?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    documentNumber?: string;
  };
  paymentConfig: {
    id: number;
    name: string;
    code: string;
  };
}

export interface AdminPaymentsResponse {
  success: boolean;
  data: {
    payments: AdminPaymentResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
  errors: null | any;
}

export interface PaymentMetadataResponse {
  success: boolean;
  data: {
    paymentMethods: Array<{
      value: string;
      label: string;
    }>;
    paymentStatuses: Array<{
      value: string;
      label: string;
    }>;
    paymentConfigs: Array<{
      id: number;
      name: string;
      code: string;
    }>;
  };
  message: string;
  errors: null | any;
}

export interface AdminPaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentConfigId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminPaymentTableMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
