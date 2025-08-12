'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useClientProducts } from '../../hooks/useClientProducts';
import type { CategoryDetail } from '../../types/product.type';
import { ProductClientCards } from '../client/ProductClientCards';
import { ProductClientFilters } from '../client/ProductClientFilters';
import { useProductClientFiltersStore } from '../stores/product-client-filters.store';

export default function ProductListClientPage({
  categories,
}: {
  categories: CategoryDetail[];
}) {
  const { filters, setFilter, setFilters } = useProductClientFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };
    if (filters.name) params.name = filters.name;
    if (filters.categoryId) params.categoryId = Number(filters.categoryId);
    return params;
  }, [filters]);

  const { data, isLoading } = useClientProducts(queryParams);

  const handlePageChange = (page: number) => setFilter('page', page);
  const handleLimitChange = (limit: number) => setFilters({ limit, page: 1 });

  return (
    <div className="container">
      <PageHeader
        title="Tienda"
        subtitle="Explora nuestros productos"
        className="mb-6"
        variant="gradient"
      />
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <ProductClientFilters
              isLoading={isLoading}
              categories={categories}
            />
          </CardContent>
        </Card>

        {isLoading && !data && (
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Cargando productos...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <ProductClientCards data={data.items} />
            <Card className="shadow-sm p-1">
              <CardContent>
                <TablePagination
                  pagination={data.pagination}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
