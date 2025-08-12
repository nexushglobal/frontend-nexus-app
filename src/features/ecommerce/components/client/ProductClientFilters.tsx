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
import { useProductClientFiltersStore } from '@/features/ecommerce/components/stores/product-client-filters.store';
import { RotateCcw, Search } from 'lucide-react';
import type { CategoryDetail } from '../../types/product.type';

interface ProductClientFiltersProps {
  isLoading?: boolean;
  categories: CategoryDetail[];
}

export function ProductClientFilters({
  isLoading = false,
  categories,
}: ProductClientFiltersProps) {
  const { filters, setFilter, resetFilters } = useProductClientFiltersStore();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar producto..."
            value={filters.name || ''}
            onChange={(e) => setFilter('name', e.target.value)}
          />
          <Button variant="secondary" disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={filters.categoryId ? String(filters.categoryId) : 'all'}
          onValueChange={(value) =>
            setFilter('categoryId', value === 'all' ? undefined : Number(value))
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFilters} disabled={isLoading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
}
