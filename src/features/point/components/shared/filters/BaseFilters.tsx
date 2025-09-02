'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  BaseFilters,
  BaseFiltersStore,
} from '@/features/point/stores/base-filters.store';
import { ChevronDown, ChevronUp, Filter, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface FilterOption {
  value: string;
  label: string;
}

interface BaseFiltersProps<T extends BaseFilters = BaseFilters> {
  isLoading?: boolean;
  store: BaseFiltersStore<T>;
  typeOptions?: FilterOption[];
  statusOptions?: FilterOption[];
  showTypeFilter?: boolean;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
}

export function BaseFilters<T extends BaseFilters = BaseFilters>({
  isLoading = false,
  store,
  typeOptions = [],
  statusOptions = [],
  showTypeFilter = true,
  showStatusFilter = true,
  showDateFilter = true,
}: BaseFiltersProps<T>) {
  const { filters, setFilter, resetFilters } = store;
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setFilter('startDate', range.from.toISOString().split('T')[0]);
    } else {
      setFilter('startDate', undefined);
    }

    if (range?.to) {
      setFilter('endDate', range.to.toISOString().split('T')[0]);
    } else {
      setFilter('endDate', undefined);
    }
  };

  const dateRange: DateRange | undefined =
    filters.startDate && filters.endDate
      ? {
          from: new Date(filters.startDate),
          to: new Date(filters.endDate),
        }
      : undefined;

  const hasActiveFilters = Boolean(
    (showTypeFilter && filters.type && filters.type !== 'all') ||
      (showStatusFilter && filters.status && filters.status !== 'all') ||
      filters.startDate ||
      filters.endDate,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtros
          </h3>
          {hasActiveFilters && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              <Filter className="h-3 w-3" />
              Filtros activos
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            disabled={isLoading}
            className="h-8 gap-1"
          >
            <Filter className="h-3 w-3" />
            Filtros avanzados
            {showAdvancedFilters ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={isLoading || !hasActiveFilters}
            className="h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        </div>
      </div>

      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
            {/* Filtro de Tipo */}
            {showTypeFilter && typeOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) =>
                    setFilter('type', value === 'all' ? undefined : value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtro de Estado */}
            {showStatusFilter && statusOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    setFilter('status', value === 'all' ? undefined : value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtro de Fecha */}
            {showDateFilter && (
              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                <label className="text-sm font-medium">Rango de fechas</label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                  disabled={isLoading}
                  placeholder="Seleccionar rango de fechas"
                  className="w-full"
                />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
