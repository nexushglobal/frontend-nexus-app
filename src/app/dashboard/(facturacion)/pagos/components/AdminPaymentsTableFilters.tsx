// src/app/dashboard/(facturacion)/pagos/components/AdminPaymentsTableFilters.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Filter,
    Loader2,
    RotateCcw,
    Search,
    Settings2,
    X
} from 'lucide-react';
import { useAdminPaymentFilters } from '../hooks/useAdminPaymentFilters';
import { PaymentMetadataResponse, PaymentStatus } from '@/types/admin-payments.types';

interface AdminPaymentsTableFiltersProps {
    search: string;
    status: PaymentStatus | undefined;
    paymentMethod: string | undefined;
    paymentConfigId: number | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    metadata: PaymentMetadataResponse;
}

const statusLabels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'Pendiente',
    [PaymentStatus.APPROVED]: 'Aprobado',
    [PaymentStatus.REJECTED]: 'Rechazado',
    [PaymentStatus.COMPLETED]: 'Completado',
};

export function AdminPaymentsTableFilters(props: AdminPaymentsTableFiltersProps) {
    const {
        searchValue,
        statusValue,
        paymentMethodValue,
        paymentConfigValue,
        dateRange,
        hasActiveFilters,
        showAdvancedFilters,
        isLoading,
        setStatusValue,
        setPaymentMethodValue,
        setPaymentConfigValue,
        setDateRange,
        setShowAdvancedFilters,
        applyFilters,
        resetFilters,
        handleSearchChange,
    } = useAdminPaymentFilters(props);

    return (
        <div className={cn(
            "w-full space-y-3 transition-opacity duration-200",
            isLoading && "opacity-60"
        )}>
            {/* Overlay de loading */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm font-medium">Aplicando filtros...</span>
                    </div>
                </div>
            )}

            <div className="relative p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium">Filtros</span>
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-2">
                                {Object.values({
                                    search: searchValue.trim() !== '',
                                    status: statusValue !== 'all',
                                    paymentMethod: paymentMethodValue !== 'all',
                                    config: paymentConfigValue !== 'all',
                                    date: dateRange.from || dateRange.to
                                }).filter(Boolean).length} activos
                            </Badge>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="h-8 px-2 lg:px-3"
                            disabled={isLoading}
                        >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Limpiar
                        </Button>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar por usuario, email, código de operación..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="pl-10"
                        disabled={isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Select value={statusValue} onValueChange={setStatusValue} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            {props.metadata.paymentStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={paymentMethodValue} onValueChange={setPaymentMethodValue} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los métodos</SelectItem>
                            {props.metadata.paymentMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                    {method.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={paymentConfigValue} onValueChange={setPaymentConfigValue} disabled={isLoading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Configuración" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las configuraciones</SelectItem>
                            {props.metadata.paymentConfigs.map((config) => (
                                <SelectItem key={config.id} value={config.id.toString()}>
                                    {config.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                                )}
                                disabled={isLoading}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                                            {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                                        </>
                                    ) : (
                                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                                    )
                                ) : (
                                    "Seleccionar fechas"
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={{
                                    from: dateRange.from,
                                    to: dateRange.to
                                }}
                                onSelect={(range) => {
                                    setDateRange({
                                        from: range?.from,
                                        to: range?.to
                                    });
                                }}
                                numberOfMonths={2}
                                locale={es}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Filtros avanzados */}
                {showAdvancedFilters && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium mb-3">Filtros avanzados</div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Aquí se pueden agregar más filtros si es necesario */}
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Más filtros disponibles próximamente...
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 sm:gap-3 sm:ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="relative flex-1 sm:flex-initial"
                        disabled={isLoading}
                    >
                        <Settings2 className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Más filtros</span>
                        {showAdvancedFilters ? (
                            <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                            <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                    </Button>

                    <Button
                        onClick={applyFilters}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Aplicando...
                            </>
                        ) : (
                            <>
                                <Filter className="h-4 w-4 mr-2" />
                                Aplicar filtros
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}