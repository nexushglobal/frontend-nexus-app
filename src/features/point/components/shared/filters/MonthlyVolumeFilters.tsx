'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMonthlyVolumeFiltersStore } from '@/features/point/stores/monthly-volume-filters.store';
import { RotateCcw, Search } from 'lucide-react';

interface MonthlyVolumeFiltersProps {
  isLoading?: boolean;
}

export function MonthlyVolumeFilters({ isLoading }: MonthlyVolumeFiltersProps) {
  const { filters, setFilter, resetFilters } = useMonthlyVolumeFiltersStore();

  const handleStatusChange = (value: string) => {
    setFilter('status', value === 'all' ? undefined : value);
  };

  const handleStartDateChange = (value: string) => {
    setFilter('startDate', value || undefined);
  };

  const handleEndDateChange = (value: string) => {
    setFilter('endDate', value || undefined);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtros
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isLoading}
          className="h-8"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs">
            Estado
          </Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger id="status" className="h-9">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="PROCESSED">Procesado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-xs">
            Fecha desde
          </Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-xs">
            Fecha hasta
          </Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </div>
      </div>
    </div>
  );
}