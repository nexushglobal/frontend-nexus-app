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
  VOUCHER = "VOUCHER",
  PAYMENT_GATEWAY = "PAYMENT_GATEWAY",
}

export interface PaymentConfig {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export interface Payment {
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

export interface PaymentDetailResponse {
  id: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  operationCode: string | null;
  bankName: string | null;
  operationDate: string | null;
  ticketNumber: string | null;
  rejectionReason: string | null;
  reviewedByEmail: string | null;
  reviewedAt: string | null;
  isArchived: boolean;
  relatedEntityType: string;
  relatedEntityId: string;
  metadata: Record<string, any>;
  externalReference: string | null;
  gatewayTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
  paymentConfig: PaymentConfig;
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

// Tipo para compatibilidad con TableQueryPagination
export interface PaymentTableMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// Tipo para el hook de filtros
export interface PaymentFiltersHookProps {
  search: string;
  status: PaymentStatus | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
