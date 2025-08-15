import { PaginationMeta } from '@/features/shared/types/api.types';

export interface WeeklyVolume {
  id: number;
  leftVolume: number;
  rightVolume: number;
  commissionEarned?: number;
  weekStartDate: Date;
  weekEndDate: Date;
  status: 'PENDING' | 'PROCESSED' | 'CANCELLED';
  selectedSide?: 'LEFT' | 'RIGHT';
  processedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyVolumeResponse extends PaginationMeta {
  items: WeeklyVolume[];
}

export interface WeeklyVolumeHistory {
  id: number;
  paymentId: string;
  volumeSide: 'LEFT' | 'RIGHT';
  volume: number;
  metadata?: Record<string, any>;
  createdAt: Date; // like "2025-06-15T23:58:45.034Z"
  updatedAt: Date; // like "2025-06-15T23:58:45.034Z"
}

export interface WeeklyVolumeHistoryResponse extends PaginationMeta {
  items: WeeklyVolumeHistory[];
}
