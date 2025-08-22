'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Download, X } from 'lucide-react';
import { useState } from 'react';
import { useDownloadLeads } from '../../hooks/useLeads';

export function DownloadLeadsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const downloadMutation = useDownloadLeads();

  const handleDateRangeChange = (
    range: { from?: Date; to?: Date } | undefined,
  ) => {
    setDateRange(range);
  };

  const handleDownload = async () => {
    try {
      await downloadMutation.mutateAsync({
        startDate: dateRange?.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      });
      setIsOpen(false);
      setDateRange(undefined);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Descargar Leads</DialogTitle>
          <DialogDescription>
            Selecciona un rango de fechas para filtrar los leads que deseas
            descargar en formato CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Rango de fechas (opcional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateRange ? 'text-muted-foreground' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yyyy', { locale: es })} -{' '}
                        {format(dateRange.to, 'dd/MM/yyyy', { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy', { locale: es })
                    )
                  ) : (
                    <span>Seleccionar fechas</span>
                  )}
                  {dateRange && (
                    <X
                      className="ml-auto h-4 w-4 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDateRange();
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
                  selected={
                    dateRange?.from
                      ? (dateRange as { from: Date; to?: Date })
                      : undefined
                  }
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Si no seleccionas fechas, se descargarán todos los leads.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloadMutation.isPending}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {downloadMutation.isPending ? 'Descargando...' : 'Descargar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
