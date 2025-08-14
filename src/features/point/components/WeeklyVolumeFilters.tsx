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
import { VOLUME_STATUS_OPTIONS } from '../constants';
import { useWeeklyVolumeFiltersStore } from '../stores/weekly-volume-filters.store';

interface WeeklyVolumeFiltersProps {
  isLoading?: boolean;
}

export function WeeklyVolumeFilters({ isLoading }: WeeklyVolumeFiltersProps) {
  const { filters, setFilter, resetFilters } = useWeeklyVolumeFiltersStore();

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
    (filters.status && filters.status !== 'all') ||
      filters.startDate ||
      filters.endDate,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Filtrar volúmenes semanales
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
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
              {VOLUME_STATUS_OPTIONS.map((option) => (
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
