import { ApiPaginationMeta } from '@/features/shared/types/api.types';

export interface Rank {
  id: number;
  name: string;
  code: string;
}

export interface MonthlyVolume {
  id: number;
  assignedRank?: Rank;
  totalVolume: number;
  leftVolume: number;
  rightVolume: number;
  leftDirects: number;
  rightDirects: number;
  monthStartDate: string;
  monthEndDate: string;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyVolumeResponse {
  pagination: ApiPaginationMeta;

  items: MonthlyVolume[];
}
