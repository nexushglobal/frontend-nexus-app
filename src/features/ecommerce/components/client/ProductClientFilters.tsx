'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductClientFiltersStore } from '@/features/ecommerce/components/stores/product-client-filters.store';
import { Filter, RotateCcw, Search, Tag } from 'lucide-react';
import type { CategoryDetail } from '../../types/product.type';

interface ProductClientFiltersProps {
  isLoading?: boolean;
  categories: CategoryDetail[];
  compact?: boolean;
}

export function ProductClientFilters({
  isLoading = false,
  categories,
  compact = false,
}: ProductClientFiltersProps) {
  const { filters, setFilter, resetFilters } = useProductClientFiltersStore();

  const hasActiveFilters = !!(filters.name || filters.categoryId);

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        {/* Search - Compact */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={filters.name || ''}
            onChange={(e) => setFilter('name', e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Category - Compact */}
        <div className="w-full sm:w-60">
          <Select
            value={filters.categoryId ? String(filters.categoryId) : 'all'}
            onValueChange={(value) =>
              setFilter(
                'categoryId',
                value === 'all' ? undefined : Number(value),
              )
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset - Compact */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={isLoading}
            className="shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {/* Active Filters - Inline */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs">
            {filters.name && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                <span>"{filters.name}"</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter('name', '')}
                  className="h-3 w-3 p-0 hover:bg-transparent"
                >
                  ×
                </Button>
              </div>
            )}
            {filters.categoryId && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                <span>
                  {categories.find((c) => c.id === filters.categoryId)?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter('categoryId', undefined)}
                  className="h-3 w-3 p-0 hover:bg-transparent"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Original non-compact layout
  return (
    <div className="space-y-4">
      {/* Main Filters - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar productos
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Escribe el nombre del producto..."
              value={filters.name || ''}
              onChange={(e) => setFilter('name', e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categoría
          </Label>
          <Select
            value={filters.categoryId ? String(filters.categoryId) : 'all'}
            onValueChange={(value) =>
              setFilter(
                'categoryId',
                value === 'all' ? undefined : Number(value),
              )
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  Todas las categorías
                </div>
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="space-y-2">
          <Label className="text-sm font-medium opacity-0">Acciones</Label>
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={isLoading || !hasActiveFilters}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filtros activos:
          </span>
          {filters.name && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              <span>"{filters.name}"</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter('name', '')}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                ×
              </Button>
            </div>
          )}
          {filters.categoryId && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              <span>
                {categories.find((c) => c.id === filters.categoryId)?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter('categoryId', undefined)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                ×
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
