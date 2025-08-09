'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useAdminProducts } from '../../hooks/useProductQuery';
import { ProductAdminCards } from '../admin/ProductAdminCards';
import { ProductAdminFilters } from '../admin/ProductAdminFilters';
import { ProductAdminTable } from '../admin/ProductAdminTable';
import { useProductAdminFiltersStore } from '../stores/product-filters.store';

export default function ProductListAdminPage() {
  const { filters, setFilter, setFilters } = useProductAdminFiltersStore();

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.name) params.name = filters.name;
    if (filters.categoryId) params.categoryId = Number(filters.categoryId);
    if (filters.isActive !== undefined) params.isActive = filters.isActive;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useAdminProducts(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  if (isError) {
    return (
      <div className="container">
        <PageHeader
          title="Gestión de Productos"
          subtitle="Administra y revisa el catálogo de productos disponibles en la tienda"
          className="mb-6"
          variant="gradient"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los productos:{' '}
            {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title="Gestión de Productos"
        subtitle="Administra y revisa el catálogo de productos disponibles en la tienda"
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent>
            <ProductAdminFilters isLoading={isLoading} />
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
            <div className="hidden md:block">
              <ProductAdminTable data={data.items} isLoading={isLoading} />
            </div>

            <div className="md:hidden">
              <ProductAdminCards data={data.items} />
            </div>

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
