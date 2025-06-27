export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum PaymentMethod {
  POINTS = "POINTS",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
}

export interface PaymentConfig {
  id: number;
  name: string;
}

export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  paymentConfig: PaymentConfig;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "ASC" | "DESC";
  sortBy?: "createdAt" | "amount" | "status" | "updatedAt";
  startDate?: string;
  endDate?: string;
  status?: PaymentStatus;
  paymentConfigId?: number;
}

export interface PaymentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaymentAppliedFilters {
  sortBy: string;
  sortOrder: string;
}

export interface PaymentMeta {
  activePaymentConfigs: PaymentConfig[];
}

export interface PaginatedPaymentsResponse {
  success: boolean;
  data: {
    items: Payment[];
    pagination: PaymentPagination;
    appliedFilters: PaymentAppliedFilters;
    meta: PaymentMeta;
  };
  message: string;
  errors: null | any;
}

// Adaptar al tipo Meta existente para usar con TableQueryPagination
export interface PaymentTableMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
