'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/context/CartStore';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  Grid3X3,
  List,
  Loader2,
  Search,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
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
  const { itemCount } = useCartStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

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
    <div className="container space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Tienda Digital"
          subtitle="Descubre nuestros productos exclusivos"
          variant="gradient"
          icon={Store}
          className="mb-0"
        />

        {/* Cart Link */}
        <Link href="/dashboard/cli-tienda/carrito">
          <Button className="gap-2 relative">
            <ShoppingCart className="h-4 w-4" />
            Mi Carrito
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* Compact Filters & Results Bar */}
      <Card className="shadow-sm py-0">
        <CardContent className="py-4">
          <div className="space-y-4">
            {/* Top Row: Filters */}
            <div className="flex flex-col  lg:flex-row lg:items-end gap-4">
              <ProductClientFilters
                isLoading={isLoading}
                categories={categories}
                compact={true}
              />
              <div className="flex justify-end pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: View Toggle Only */}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && !data && <LoadingState />}

        {/* Products */}
        {data && (
          <>
            <ProductClientCards data={data.items} viewMode={viewMode} />

            {/* Pagination */}
            <Card className="shadow-sm">
              <CardContent className="py-3">
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

        {/* Empty State */}
        {data && data.items.length === 0 && <EmptyProductsState />}
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Cargando productos</h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando los mejores productos para ti...
        </p>
      </CardContent>
    </Card>
  );
}

// Empty Products State
function EmptyProductsState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No se encontraron productos
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          No hay productos que coincidan con tus filtros actuales. Intenta
          ajustar los criterios de búsqueda.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reiniciar filtros
        </Button>
      </CardContent>
    </Card>
  );
}
