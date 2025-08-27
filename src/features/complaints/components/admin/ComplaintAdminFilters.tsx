'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, X } from 'lucide-react';
import { useComplaintFiltersStore } from '../../stores/complaint-filters.store';

interface ComplaintAdminFiltersProps {
  isLoading?: boolean;
}

export function ComplaintAdminFilters({ isLoading }: ComplaintAdminFiltersProps) {
  const { filters, setFilter, resetFilters } = useComplaintFiltersStore();

  const handleDateChange = (value: string) => {
    setFilter('startDate', value || undefined);
  };

  const handleAttendedChange = (value: string) => {
    if (value === 'all') {
      setFilter('attended', undefined);
    } else {
      setFilter('attended', value === 'true');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-2 lg:px-3"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Estado de atención */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Estado
          </label>
          <Select
            value={
              filters.attended === undefined
                ? 'all'
                : filters.attended.toString()
            }
            onValueChange={handleAttendedChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="false">Pendientes</SelectItem>
              <SelectItem value="true">Atendidos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fecha desde */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Fecha desde
          </label>
          <div className="relative">
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={isLoading}
              className="pl-10"
            />
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Límite de resultados */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Resultados por página
          </label>
          <Select
            value={filters.limit?.toString() || '20'}
            onValueChange={(value) => setFilter('limit', parseInt(value))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spacer para alineación */}
        <div />
      </div>
    </div>
  );
}