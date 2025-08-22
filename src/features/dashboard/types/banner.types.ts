import { PaginationMeta } from '@/features/shared/types/api.types';

// Enums
export enum LinkType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

// Base banner interface
export interface BaseBanner {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  linkType?: LinkType;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Full banner with metadata
export interface Banner extends BaseBanner {
  createdAt: Date;
  updatedAt: Date;
}

// Active banner for client views (simplified)
export interface ActiveBanner {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  linkType?: LinkType;
  startDate?: Date;
  endDate?: Date;
}

// API Response types
export interface BannerListResponse extends PaginationMeta {
  items: Banner[];
}

export interface ActiveBannerListResponse {
  items: ActiveBanner[];
}

export interface BannerCreateResponse {
  id: string;
  imageUrl: string;
}

export interface BannerUpdateResponse {
  id: string;
}

// Request types
export interface BannerCreateRequest {
  title?: string;
  description?: string;
  link?: string;
  linkType?: LinkType;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  bannerImage: File;
}

export interface BannerUpdateRequest {
  title?: string;
  description?: string;
  link?: string;
  linkType?: LinkType;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  bannerImage?: File;
}

export interface BannerReorderRequest {
  banners: Array<{
    id: string;
    order: number;
  }>;
}

// Query parameters
export interface BannerListParams {
  page?: number;
  limit?: number;
}

// Form data types for server actions
export interface BannerFormData {
  title?: string;
  description?: string;
  link?: string;
  linkType?: LinkType;
  isActive?: boolean;
  startDate?: string; // ISO string for form handling
  endDate?: string;   // ISO string for form handling
  bannerImage?: File;
}

// Table and UI types
export interface BannerTableItem extends Banner {
  // Add any computed properties for table display
  status: 'active' | 'inactive' | 'scheduled' | 'expired';
}