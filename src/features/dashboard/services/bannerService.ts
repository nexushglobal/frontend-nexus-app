'use client';

import { api } from '@/features/shared/services/api';
import type {
  ActiveBannerListResponse,
  BannerListResponse,
  BannerReorderRequest,
  BannerUpdateResponse,
} from '../types/banner.types';

/**
 * Banner Service
 * Client-side service for banner-related API calls
 * Used for interactive features, data fetching with TanStack Query
 */
export class BannerService {
  /**
   * Get paginated list of banners (Admin)
   */
  static async getBanners(params: {
    page?: number;
    limit?: number;
  }): Promise<BannerListResponse> {
    return api.get<BannerListResponse>('/api/banners', { params });
  }

  /**
   * Get list of active banners (Public/Client)
   */
  static async getActiveBanners(): Promise<ActiveBannerListResponse> {
    return api.get<ActiveBannerListResponse>('/api/banners/active');
  }

  // Note: Individual banner details and updates are handled via server actions
  // Only keeping the specific APIs that were requested

  /**
   * Reorder banners (Admin)
   */
  static async reorderBanners(data: BannerReorderRequest): Promise<void> {
    console.log('Reordering banners:', data);
    return api.put<void>('/api/banners/list/order', data);
  }

  /**
   * Toggle banner active status (Admin)
   */
  static async toggleBannerStatus(
    id: string,
    isActive: boolean,
  ): Promise<BannerUpdateResponse> {
    return api.patch<BannerUpdateResponse>(`/api/banners/${id}`, {
      isActive,
    });
  }
}
