'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../service/productService';
import type { ProductClientResponse } from '../types/product.type';

export function useClientProducts(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<ProductClientResponse>({
    queryKey: ['client-products', params],
    queryFn: () => ProductService.getClientListProducts(params),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}
