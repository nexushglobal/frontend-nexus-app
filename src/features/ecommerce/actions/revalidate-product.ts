'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { PRODUCT_CACHE_TAGS } from '../constants/product.constants';

export async function revalidateAdminProducts() {
  revalidateTag(PRODUCT_CACHE_TAGS.PRODUCT_LIST);
  revalidatePath('/dashboard/fac-ecommerce/productos');
}

export async function revalidateProductDetail(productId: string) {
  if (!productId?.trim()) {
    throw new Error('Product ID is required');
  }

  revalidateTag(`${PRODUCT_CACHE_TAGS.PRODUCT_DETAILS}-${productId}`);
  revalidatePath(`/dashboard/fac-ecommerce/productos/detalle/${productId}`);
}
