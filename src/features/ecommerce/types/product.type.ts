import { PaginationMeta } from '@/features/shared/types/api.types';

export interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  order: number;
}

export interface BaseCategory {
  id: number;
  name: string;
  code: string;
}

export interface CategoryDetail extends BaseCategory {
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  items: CategoryDetail[];
}

interface BaseProduct {
  id: number;
  name: string;
  description: string;
  composition: string;
  sku: string;
  memberPrice: number;
  publicPrice: number;
  isActive: boolean;
  category: BaseCategory;
  benefits: string[];
  imagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAdmin extends BaseProduct {
  stock: number;
  status: string;
  mainImage: string;
}

export interface ProductAdminResponse extends PaginationMeta {
  items: ProductAdmin[];
}

export interface ProductDetailAdmin extends BaseProduct {
  images: ProductImage[];
  stock: number;
  status: string;
}

export interface StockProductHistory {
  id: number;
  actionType: string;
  previousQuantity: number;
  newQuantity: number;
  quantityChanged: number;
  notes: string;
  createdAt: string;
  updatedBy: {
    id: string;
    email: string;
  };
}

export interface StockProductHistoryResponse extends PaginationMeta {
  items: StockProductHistory[];
}
