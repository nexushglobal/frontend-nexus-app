'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategoriesAction } from '../../actions/get-products';
import type { CategoryDetail } from '../../types/product.type';
import { useProductAdminFiltersStore } from '../stores/product-filters.store';

interface ProductAdminFiltersProps {
  isLoading?: boolean;
}

export function ProductAdminFilters({
  isLoading = false,
}: ProductAdminFiltersProps) {
  const { filters, setFilter, setFilters, resetFilters } =
    useProductAdminFiltersStore();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const result = await getCategoriesAction();
        if (result.success && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Verificar si hay filtros activos (excluyendo paginación)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit') return false;
    return value !== undefined && value !== '' && value !== null;
  });

  // Verificar si hay filtros avanzados activos
  const hasAdvancedFilters = Boolean(
    filters.categoryId || filters.isActive !== undefined,
  );

  return (
    <div className="space-y-4">
      {/* Filtros principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por nombre */}
        <div className="relative col-span-full sm:col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={filters.name || ''}
            onChange={(e) => setFilter('name', e.target.value || undefined)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {filters.name && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setFilter('name', undefined)}
              disabled={isLoading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 sm:gap-3 sm:ml-auto lg:col-span-2">
          {/* Botón de filtros avanzados */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="relative flex-1 sm:flex-initial"
            disabled={isLoading}
          >
            <Settings2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Filtros avanzados</span>
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
            {/* Indicador de filtros activos */}
            {hasAdvancedFilters && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white" />
            )}
          </Button>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={isLoading}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filtros avanzados colapsables */}
      {showAdvancedFilters && (
        <div className="p-4 bg-muted/50 rounded-lg border border-dashed space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Filtros avanzados
              </span>
            </div>
            {hasAdvancedFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilter('categoryId', undefined);
                  setFilter('isActive', undefined);
                }}
                disabled={isLoading}
                className="text-muted-foreground text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar filtros avanzados
              </Button>
            )}
          </div>

          {/* Grid de filtros avanzados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Categoría
              </label>
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(value) =>
                  setFilter('categoryId', value === 'all' ? undefined : value)
                }
                disabled={isLoading || categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado activo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Estado
              </label>
              <Select
                value={
                  filters.isActive === undefined
                    ? 'all'
                    : filters.isActive.toString()
                }
                onValueChange={(value) => {
                  if (value === 'all') {
                    setFilter('isActive', undefined);
                  } else {
                    setFilter('isActive', value === 'true');
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
