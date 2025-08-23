'use client';

import { api } from '@/features/shared/services/api';
import type {
  ActiveBanner,
  BannerListResponse,
  BannerReorderRequest,
  BannerUpdateResponse,
} from '../types/banner.types';

export class BannerService {
  static async getBanners(params: {
    page?: number;
    limit?: number;
  }): Promise<BannerListResponse> {
    return api.get<BannerListResponse>('/api/banners', { params });
  }

  static async getActiveBanners(): Promise<ActiveBanner[]> {
    return api.get<ActiveBanner[]>('/api/banners/active');
  }

  static async reorderBanners(data: BannerReorderRequest): Promise<void> {
    return api.put<void>('/api/banners/list/order', data);
  }

  static async toggleBannerStatus(
    id: string,
    isActive: boolean,
  ): Promise<BannerUpdateResponse> {
    return api.patch<BannerUpdateResponse>(`/api/banners/${id}`, {
      isActive,
    });
  }
}
