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
