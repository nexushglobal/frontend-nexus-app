'use server';

import { api } from '@/features/shared/services/api';
import {
  CATEGORY_CACHE_TAGS,
  REVALIDATE_TIME,
} from '../constants/product.constants';
import { CategoryDetail } from '../types/product.type';

export async function getCategoriesAction() {
  try {
    const response = await api.get<CategoryDetail[]>('/api/product-category', {
      next: {
        tags: [CATEGORY_CACHE_TAGS.CATEGORY_LIST],
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
      message: 'Error al obtener las categorías',
      errors: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
}
