// src/features/payment/stores/payment-filters.store.ts
import {
  createTableFiltersStore,
  type TableFilters,
} from "@/features/shared/stores/table-filters.store";

export interface PaymentFilters extends TableFilters {
  search?: string;
  status?: string;
  paymentConfigId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "amount" | "status" | "updatedAt";
  sortOrder?: "ASC" | "DESC";
}

const initialPaymentFilters: Partial<PaymentFilters> = {
  sortBy: "createdAt",
  sortOrder: "DESC",
  limit: 10,
};

// Store para filtros de pagos de admin
export const usePaymentAdminFiltersStore = createTableFiltersStore(
  "payment-admin",
  initialPaymentFilters
);

// Store para filtros de pagos de usuario
export const usePaymentUserFiltersStore = createTableFiltersStore(
  "payment-user",
  initialPaymentFilters
);
