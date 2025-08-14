'use client';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, RotateCcw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  LOT_TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from '../constants';
import { usePointLotFiltersStore } from '../stores/point-lot-filters.store';

interface PointLotFiltersProps {
  isLoading?: boolean;
}

export function PointLotFilters({ isLoading }: PointLotFiltersProps) {
  const { filters, setFilter, resetFilters } = usePointLotFiltersStore();

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
    (filters.type && filters.type !== 'all') ||
      (filters.status && filters.status !== 'all') ||
      filters.startDate ||
      filters.endDate,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filtrar transacciones de lote
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Tipo de transacción */}
        <div className="flex-1">
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              setFilter('type', value === 'all' ? undefined : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {LOT_TRANSACTION_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="flex-1">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilter('status', value === 'all' ? undefined : value)
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {TRANSACTION_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rango de fechas */}
        <div className="flex-1">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={handleDateRangeChange}
            placeholder="Seleccionar fechas"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Botón reset */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={isLoading}
            className="px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
