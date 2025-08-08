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
import { useState } from 'react';
import { useOrderAdminFiltersStore } from '../stores/order-filters.store';

interface OrderAdminFiltersProps {
  isLoading?: boolean;
}

export function OrderAdminFilters({
  isLoading = false,
}: OrderAdminFiltersProps) {
  const { filters, setFilter, setFilters, resetFilters } =
    useOrderAdminFiltersStore();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Verificar si hay filtros activos (excluyendo paginación)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit') return false;
    return value !== undefined && value !== '' && value !== null;
  });

  // Verificar si hay filtros avanzados activos
  const hasAdvancedFilters = Boolean(
    filters.status || filters.startDate || filters.endDate,
  );

  return (
    <div className="space-y-4">
      {/* Filtros principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda por usuario */}
        <div className="relative col-span-full sm:col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario..."
            value={filters.term || ''}
            onChange={(e) => setFilter('term', e.target.value || undefined)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {filters.term && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setFilter('term', undefined)}
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
            className={`gap-2 ${
              hasAdvancedFilters ? 'bg-primary/5 border-primary/20' : ''
            }`}
            disabled={isLoading}
          >
            <Settings2 className="h-4 w-4" />
            Filtros
            {hasAdvancedFilters && (
              <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs">
                {
                  [filters.status, filters.startDate, filters.endDate].filter(
                    Boolean,
                  ).length
                }
              </span>
            )}
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {/* Botón de reset */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="gap-2"
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="pt-4 border-t border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Estado
              </label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  setFilter('status', value === 'all' ? undefined : value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="APPROVED">Aprobado</SelectItem>
                  <SelectItem value="SENT">Enviado</SelectItem>
                  <SelectItem value="REJECTED">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha de inicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Fecha de inicio
              </label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilter('startDate', e.target.value || undefined)
                }
                disabled={isLoading}
              />
            </div>

            {/* Fecha de fin */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Fecha de fin
              </label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilter('endDate', e.target.value || undefined)
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
