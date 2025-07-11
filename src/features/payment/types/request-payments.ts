import { PaymentStatus } from "./enums-payments";

export interface PaymentFiltersRequest {
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
