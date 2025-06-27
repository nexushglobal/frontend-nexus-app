// src/app/dashboard/(cliente)/mis-pagos/components/PaymentsTableFilters.tsx
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
import { PaymentConfig, PaymentStatus } from '@/types/payments/payments.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Calendar,
    FilterX,
    Search,
    SortAsc,
    SortDesc,
    X,
    CreditCard,
    DollarSign
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface PaymentsTableFiltersProps {
    search: string;
    status: PaymentStatus | undefined;
    paymentConfigId: number | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    paymentConfigs: PaymentConfig[];
}

export function PaymentsTableFilters({
    search: initialSearch,
    status: initialStatus,
    paymentConfigId: initialPaymentConfigId,
    startDate: initialStartDate,
    endDate: initialEndDate,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
    paymentConfigs
}: PaymentsTableFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estados locales para controlar los inputs
    const [searchValue, setSearchValue] = useState(initialSearch);
    const [statusValue, setStatusValue] = useState<string>(
        initialStatus || 'all'
    );
    const [paymentConfigValue, setPaymentConfigValue] = useState<string>(
        initialPaymentConfigId?.toString() || 'all'
    );
    const [sortByValue, setSortByValue] = useState<string>(initialSortBy);
    const [sortOrderValue, setSortOrderValue] = useState<'ASC' | 'DESC'>(initialSortOrder);

    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: initialStartDate ? new Date(initialStartDate) : undefined,
        to: initialEndDate ? new Date(initialEndDate) : undefined
    });

    const hasActiveFilters =
        searchValue ||
        statusValue !== 'all' ||
        paymentConfigValue !== 'all' ||
        dateRange.from ||
        dateRange.to ||
        sortOrderValue !== 'DESC' ||
        sortByValue !== 'createdAt';

    // Función para crear query string actualizado
    const createQueryString = useCallback(
        (updates: { [key: string]: string }) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([name, value]) => {
                if (value === '' || value === 'all') {
                    params.delete(name);
                } else {
                    params.set(name, value);
                }
            });

            // Siempre resetear a página 1 cuando se aplican filtros
            params.set('page', '1');

            return params.toString();
        },
        [searchParams]
    );

    // Debounce para búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        const timeoutId = setTimeout(() => {
            router.push(`${pathname}?${createQueryString({ search: value })}`);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleStatusChange = (value: string) => {
        setStatusValue(value);
        router.push(`${pathname}?${createQueryString({ status: value === 'all' ? '' : value })}`);
    };

    const handlePaymentConfigChange = (value: string) => {
        setPaymentConfigValue(value);
        router.push(`${pathname}?${createQueryString({ paymentConfigId: value === 'all' ? '' : value })}`);
    };

    const handleSortByChange = (value: string) => {
        setSortByValue(value);
        router.push(`${pathname}?${createQueryString({ sortBy: value })}`);
    };

    const handleSortOrderChange = (value: 'ASC' | 'DESC') => {
        setSortOrderValue(value);
        router.push(`${pathname}?${createQueryString({ sortOrder: value })}`);
    };

    const handleCalendarChange = (range: { from?: Date; to?: Date }) => {
        setDateRange({
            from: range.from ?? undefined,
            to: range.to ?? undefined
        });

        const updates: { [key: string]: string } = {};
        if (range.from) updates.startDate = range.from.toISOString().split('T')[0];
        if (range.to) updates.endDate = range.to.toISOString().split('T')[0];

        router.push(`${pathname}?${createQueryString(updates)}`);
    };

    const resetFilters = () => {
        setSearchValue('');
        setStatusValue('all');
        setPaymentConfigValue('all');
        setSortByValue('createdAt');
        setSortOrderValue('DESC');
        setDateRange({ from: undefined, to: undefined });
        router.push(pathname);
    };

    const clearDateRange = () => {
        setDateRange({ from: undefined, to: undefined });
        router.push(`${pathname}?${createQueryString({ startDate: '', endDate: '' })}`);
    };

    // Función para obtener el label del status
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'APPROVED': return 'Aprobado';
            case 'REJECTED': return 'Rechazado';
            case 'COMPLETED': return 'Completado';
            default: return status;
        }
    };

    // Función para obtener el label del campo de ordenamiento
    const getSortByLabel = (sortBy: string) => {
        switch (sortBy) {
            case 'createdAt': return 'Fecha de creación';
            case 'amount': return 'Monto';
            case 'status': return 'Estado';
            case 'updatedAt': return 'Fecha de actualización';
            default: return sortBy;
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <FilterX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Filtros de búsqueda
                    </h3>
                    {hasActiveFilters && (
                        <Badge
                            variant="secondary"
                            className="ml-2 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                            Filtros activos
                        </Badge>
                    )}
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="h-8 px-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {/* Search Input */}
                <div className="relative lg:col-span-2">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar pagos..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="pl-9 transition-colors focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Status Filter */}
                <Select value={statusValue} onValueChange={handleStatusChange}>
                    <SelectTrigger className="transition-colors focus:border-blue-500 focus:ring-blue-500">
                        <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                            <SelectValue placeholder="Estado" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="PENDING">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                Pendiente
                            </div>
                        </SelectItem>
                        <SelectItem value="APPROVED">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Aprobado
                            </div>
                        </SelectItem>
                        <SelectItem value="REJECTED">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                Rechazado
                            </div>
                        </SelectItem>
                        <SelectItem value="COMPLETED">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                Completado
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Payment Config Filter */}
                <Select value={paymentConfigValue} onValueChange={handlePaymentConfigChange}>
                    <SelectTrigger className="transition-colors focus:border-blue-500 focus:ring-blue-500">
                        <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                            <SelectValue placeholder="Tipo de pago" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        {paymentConfigs.map((config) => (
                            <SelectItem key={config.id} value={config.id.toString()}>
                                {config.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal transition-colors focus:border-blue-500 focus:ring-blue-500',
                                (dateRange.from || dateRange.to) &&
                                'border-blue-500 text-blue-600 dark:text-blue-400'
                            )}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, 'dd/MM/yy', { locale: es })} -{' '}
                                        {format(dateRange.to, 'dd/MM/yy', { locale: es })}
                                    </>
                                ) : (
                                    format(dateRange.from, 'dd/MM/yyyy', { locale: es })
                                )
                            ) : (
                                'Rango de fechas'
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={dateRange}
                            onSelect={(range) =>
                                handleCalendarChange(range ?? { from: undefined, to: undefined })
                            }
                            numberOfMonths={2}
                            locale={es}
                            className="rounded-md border"
                        />
                        <div className="flex justify-between gap-2 border-t p-3">
                            <Button variant="outline" size="sm" onClick={clearDateRange} className="text-sm">
                                <X className="mr-1 h-3 w-3" />
                                Limpiar
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Sort By Filter */}
                <Select value={sortByValue} onValueChange={handleSortByChange}>
                    <SelectTrigger className="transition-colors focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Fecha de creación</SelectItem>
                        <SelectItem value="amount">Monto</SelectItem>
                        <SelectItem value="status">Estado</SelectItem>
                        <SelectItem value="updatedAt">Fecha de actualización</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Order Filter */}
                <Select
                    value={sortOrderValue}
                    onValueChange={(value: 'ASC' | 'DESC') => handleSortOrderChange(value)}
                >
                    <SelectTrigger className="transition-colors focus:border-blue-500 focus:ring-blue-500">
                        <div className="flex items-center">
                            {sortOrderValue === 'DESC' ? (
                                <SortDesc className="mr-2 h-4 w-4 text-gray-400" />
                            ) : (
                                <SortAsc className="mr-2 h-4 w-4 text-gray-400" />
                            )}
                            <SelectValue placeholder="Orden" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="DESC">
                            <div className="flex items-center gap-2">
                                <SortDesc className="h-4 w-4" />
                                Más recientes primero
                            </div>
                        </SelectItem>
                        <SelectItem value="ASC">
                            <div className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4" />
                                Más antiguos primero
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}