'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
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
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useState } from 'react';

interface MonthlyVolumeFiltersProps {
  isLoading?: boolean;
}

export function MonthlyVolumeFilters({ isLoading }: MonthlyVolumeFiltersProps) {
  const { filters, setFilter, resetFilters } = useMonthlyVolumeFiltersStore();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  const hasActiveFilters = !!(
    filters.status ||
    filters.startDate ||
    filters.endDate
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
            onClick={handleReset}
            disabled={isLoading || !hasActiveFilters}
            className="h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Limpiar
          </Button>
        </div>
      </div>

      <Collapsible
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
      >
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-medium">
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
              <Label htmlFor="startDate" className="text-xs font-medium">
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
              <Label htmlFor="endDate" className="text-xs font-medium">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
