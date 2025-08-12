'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../service/productService';
import type { ProductClientDetail } from '../types/product.type';

export function useClientProductDetail(productId: string | number) {
  const id = Number(productId);
  return useQuery<ProductClientDetail>({
    queryKey: ['client-product-detail', id],
    queryFn: () => ProductService.getClientProduct(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}
