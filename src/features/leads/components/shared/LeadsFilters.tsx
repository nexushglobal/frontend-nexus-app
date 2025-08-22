"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  RotateCcw,
  X,
} from "lucide-react";
import { useLeadsFiltersStore } from "../../stores/leads-filters.store";

interface LeadsFiltersProps {
  isLoading?: boolean;
}

export function LeadsFilters({ isLoading = false }: LeadsFiltersProps) {
  const { filters, setFilter, resetFilters } = useLeadsFiltersStore();

  const hasActiveFilters = Boolean(filters.startDate || filters.endDate);

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      setFilter("startDate", format(range.from, "yyyy-MM-dd"));
      setFilter(
        "endDate",
        range.to ? format(range.to, "yyyy-MM-dd") : format(range.from, "yyyy-MM-dd")
      );
    } else {
      setFilter("startDate", undefined);
      setFilter("endDate", undefined);
    }
  };

  const dateRange = filters.startDate
    ? {
        from: new Date(filters.startDate),
        to: filters.endDate
          ? new Date(filters.endDate)
          : new Date(filters.startDate),
      }
    : undefined;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Rango de fechas */}
      <div className="flex-1">
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
  );
}