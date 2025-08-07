import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../service/productService';
import type { ProductAdminResponse } from '../types/product.type';

export function useAdminProducts(
  params: Record<string, string | number | boolean | undefined | null>,
) {
  return useQuery<ProductAdminResponse>({
    queryKey: ['admin-products', params],
    queryFn: () => ProductService.getAdminProducts(params),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false,
  });
}
