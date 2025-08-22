'use server';

import { api } from '@/features/shared/services/api';
import { revalidateTag } from 'next/cache';
import type {
  BannerCreateResponse,
  BannerUpdateResponse,
} from '../types/banner.types';

/**
 * Server Actions for Banner Management
 * Used for operations that require server-side processing, especially file uploads
 */

/**
 * Create new banner with image upload
 */
export async function createBannerAction(formData: FormData) {
  try {
    // Validate required fields
    const bannerImage = formData.get('bannerImage') as File;
    if (!bannerImage || bannerImage.size === 0) {
      return {
        success: false,
        message: 'Banner image is required',
        errors: 'Banner image is required',
        data: null,
      };
    }

    // Validate image type
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!validImageTypes.includes(bannerImage.type)) {
      return {
        success: false,
        message:
          'Invalid image type. Please upload a JPEG, PNG, WebP, or GIF image.',
        errors: 'Invalid image type',
        data: null,
      };
    }

    // Validate image size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (bannerImage.size > maxSize) {
      return {
        success: false,
        message: 'Image size too large. Maximum size is 10MB.',
        errors: 'Image size too large',
        data: null,
      };
    }

    // Validate dates if provided
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return {
          success: false,
          message: 'End date must be after start date',
          errors: 'End date must be after start date',
          data: null,
        };
      }
    }

    // Make API call
    const response = await api.post<BannerCreateResponse>(
      '/api/banners',
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );

    // Revalidate cache
    revalidateTag('banners');
    revalidateTag('active-banners');

    return {
      success: true,
      message: 'Banner created successfully',
      data: response,
      errors: null,
    };
  } catch (error) {
    console.error('Error creating banner:', error);
    return {
      success: false,
      message: 'Failed to create banner',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Update banner with optional image upload
 */
export async function updateBannerAction(id: string, formData: FormData) {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Banner ID is required',
        errors: 'Banner ID is required',
        data: null,
      };
    }

    // Check if there's a new image
    const bannerImage = formData.get('bannerImage') as File;

    // If there's a new image, validate it
    if (bannerImage && bannerImage.size > 0) {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      if (!validImageTypes.includes(bannerImage.type)) {
        return {
          success: false,
          message:
            'Invalid image type. Please upload a JPEG, PNG, WebP, or GIF image.',
          errors: 'Invalid image type',
          data: null,
        };
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (bannerImage.size > maxSize) {
        return {
          success: false,
          message: 'Image size too large. Maximum size is 10MB.',
          errors: 'Image size too large',
          data: null,
        };
      }
    } else {
      // Remove empty file from formData
      formData.delete('bannerImage');
    }

    // Validate dates if provided
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return {
          success: false,
          message: 'End date must be after start date',
          errors: 'End date must be after start date',
          data: null,
        };
      }
    }

    // Make API call
    const response = await api.patch<BannerUpdateResponse>(
      `/api/banners/${id}`,
      formData,
      {
        isFormData: true,
        skipJsonStringify: true,
      },
    );

    // Revalidate cache
    revalidateTag('banners');
    revalidateTag('active-banners');

    return {
      success: true,
      message: 'Banner updated successfully',
      data: response,
      errors: null,
    };
  } catch (error) {
    console.error('Error updating banner:', error);
    return {
      success: false,
      message: 'Failed to update banner',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Delete banner
 */
export async function deleteBannerAction(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        message: 'Banner ID is required',
        errors: 'Banner ID is required',
        data: null,
      };
    }

    await api.delete(`/api/app/banners/${id}`);

    // Revalidate cache
    revalidateTag('banners');
    revalidateTag('active-banners');

    return {
      success: true,
      message: 'Banner deleted successfully',
      data: null,
      errors: null,
    };
  } catch (error) {
    console.error('Error deleting banner:', error);
    return {
      success: false,
      message: 'Failed to delete banner',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

/**
 * Revalidate banner caches manually
 */
export async function revalidateBannersAction() {
  revalidateTag('banners');
  revalidateTag('active-banners');
}
