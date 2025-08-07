'use server';

import { api } from '@/features/shared/services/api';
import {
  CATEGORY_CACHE_TAGS,
  PRODUCT_CACHE_TAGS,
  REVALIDATE_TIME,
} from '../constants/product.constants';
import {
  ProductAdminResponse,
  ProductDetailAdmin,
  StockProductHistoryResponse,
} from '../types/product.type';

export async function getProductsAdminAction() {
  try {
    const response = await api.get<ProductAdminResponse>('/api/products', {
      next: {
        tags: [PRODUCT_CACHE_TAGS.PRODUCT_LIST],
        revalidate: REVALIDATE_TIME,
      },
    });

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener los productos',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function getCategoriesAction() {
  try {
    const response = await api.get<ProductAdminResponse>(
      '/api/product-category',
      {
        next: {
          tags: [CATEGORY_CACHE_TAGS.CATEGORY_LIST],
          revalidate: REVALIDATE_TIME,
        },
      },
    );

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener las categorías',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function getProductAdminAction(id: number) {
  try {
    const response = await api.get<ProductDetailAdmin>(`/api/products/${id}`, {
      next: {
        tags: [PRODUCT_CACHE_TAGS.PRODUCT_DETAILS + `-${id}`],
        revalidate: REVALIDATE_TIME,
      },
    });

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener el producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}

export async function getHistoryProductStockAction(id: number) {
  try {
    const response = await api.get<StockProductHistoryResponse>(
      `/api/product-stock-history/${id}/stock`,
      {
        cache: 'no-store',
      },
    );

    return {
      data: response,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener el historial de stock del producto',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
