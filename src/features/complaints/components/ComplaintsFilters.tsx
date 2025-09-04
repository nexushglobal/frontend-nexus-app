'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FilterX, 
  Filter, 
  Settings2, 
  ChevronUp, 
  ChevronDown, 
  CalendarIcon,
  X,
  RotateCcw
} from 'lucide-react';
import { useComplaintsFiltersStore } from '../stores/complaints-filters.store';

interface ComplaintsFiltersProps {
  isLoading?: boolean;
}

export function ComplaintsFilters({ isLoading = false }: ComplaintsFiltersProps) {
  const { filters, setFilter, resetFilters } = useComplaintsFiltersStore();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.startDate && filters.endDate) {
      return {
        from: new Date(filters.startDate),
        to: new Date(filters.endDate),
      };
    }
    return undefined;
  });

  // Verificar si hay filtros activos (excluyendo paginación)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit') return false;
    return value !== undefined && value !== '' && value !== null;
  });

  // Verificar si hay filtros avanzados activos
  const hasAdvancedFilters = Boolean(
    filters.startDate || filters.endDate || filters.attended !== undefined
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      setFilter('startDate', format(range.from, 'yyyy-MM-dd'));
      setFilter('endDate', range.to ? format(range.to, 'yyyy-MM-dd') : format(range.from, 'yyyy-MM-dd'));
    } else {
      setFilter('startDate', undefined);
      setFilter('endDate', undefined);
    }
    // Reset to first page when filters change
    setFilter('page', 1);
  };

  const handleAttendedChange = (value: string) => {
    if (value === 'all') {
      setFilter('attended', undefined);
    } else {
      setFilter('attended', value === 'true');
    }
    // Reset to first page when filters change
    setFilter('page', 1);
  };

  const handleResetAdvancedFilters = () => {
    setFilter('startDate', undefined);
    setFilter('endDate', undefined);
    setFilter('attended', undefined);
    setDateRange(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Sección principal: Controles básicos */}
      <div className="space-y-3">
        {/* Controles de la primera fila */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Filtros de Reclamos</h3>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
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
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-white" />
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
                onClick={handleResetAdvancedFilters}
                disabled={isLoading}
                className="text-muted-foreground text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar filtros avanzados
              </Button>
            )}
          </div>

          {/* Grid de filtros avanzados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estado de Atención */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Estado de Atención
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
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="true">Atendidos</SelectItem>
                  <SelectItem value="false">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rango de fechas */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rango de fechas
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !dateRange ? "text-muted-foreground" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      <span>Seleccionar fechas</span>
                    )}
                    {dateRange && (
                      <X
                        className="ml-auto h-4 w-4 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateRangeChange(undefined);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    locale={es}
                    disabled={isLoading}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}