import { Transaction } from './points.types';

export interface UserPointsResponse {
  availablePoints: number;
  totalEarnedPoints: number;
  totalWithdrawnPoints: number;
  membershipPlan: {
    name: string;
  };
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionResponse {
  items: Transaction[];
  meta: PaginationMeta;
}
