'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { revalidateBannersAction } from '../actions/banner.actions';
import { BannerService } from '../services/bannerService';
import type {
  BannerListParams,
  BannerReorderRequest,
} from '../types/banner.types';

/**
 * Query keys for banner-related queries
 */
export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (params: BannerListParams) => [...bannerKeys.lists(), params] as const,
  active: () => [...bannerKeys.all, 'active'] as const,
};

/**
 * Hook for fetching paginated banners (Admin)
 */
export function useBanners(params: BannerListParams = {}) {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => BannerService.getBanners(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 403/404 errors
      if (error?.statusCode === 403 || error?.statusCode === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook for fetching active banners (Public/Client)
 */
export function useActiveBanners() {
  return useQuery({
    queryKey: bannerKeys.active(),
    queryFn: () => BannerService.getActiveBanners(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.statusCode === 403 || error?.statusCode === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Note: Individual banner fetching removed - only the 5 requested APIs are supported

/**
 * Hook for updating banner (with optional file upload)
 */
export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      // Use server action for file upload handling
      const { updateBannerAction } = await import('../actions/banner.actions');
      return updateBannerAction(id, data);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch banner queries
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });

      toast.success('Banner updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update banner');
    },
  });
}

// Note: Delete functionality removed - only the 5 requested APIs are supported

/**
 * Hook for reordering banners
 */
export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BannerReorderRequest) =>
      BannerService.reorderBanners(data),
    onSuccess: () => {
      // Invalidate and refetch all banner lists
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });

      // Also revalidate server-side cache
      revalidateBannersAction();

      toast.success('Banners reordered successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reorder banners');
    },
  });
}

/**
 * Hook for toggling banner status
 */
export function useToggleBannerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      BannerService.toggleBannerStatus(id, isActive),
    onSuccess: (data, variables) => {
      // Invalidate and refetch banner queries
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active() });

      // Also revalidate server-side cache
      revalidateBannersAction();

      const status = variables.isActive ? 'activated' : 'deactivated';
      toast.success(`Banner ${status} successfully`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update banner status');
    },
  });
}

/**
 * Hook for creating new banner (with file upload)
 * Uses server action for file upload handling
 */
export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // We'll use server actions for file uploads
      const { createBannerAction } = await import('../actions/banner.actions');
      return createBannerAction(formData);
    },
    onSuccess: () => {
      // Invalidate and refetch all banner queries
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });

      toast.success('Banner created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create banner');
    },
  });
}
