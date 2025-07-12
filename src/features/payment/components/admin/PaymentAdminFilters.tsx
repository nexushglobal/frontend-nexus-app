// src/features/payment/components/admin/PaymentAdminFilters.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, RotateCcw } from 'lucide-react'
import { usePaymentAdminFiltersStore } from '../../stores/payment-filters.store'
import { PAYMENT_STATUS_LABELS } from '../../constants/payments.constants'
import type { PaymentConfig } from '../../types/response-payment'
import { useMemo } from 'react'
import { addDays, format } from 'date-fns'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'

interface PaymentAdminFiltersProps {
    paymentConfigs: PaymentConfig[]
    isLoading?: boolean
}

export function PaymentAdminFilters({
    paymentConfigs,
    isLoading = false
}: PaymentAdminFiltersProps) {
    const { filters, setFilter, resetFilters } = usePaymentAdminFiltersStore()

    // Convertir fechas para el date picker
    const dateRange = useMemo(() => {
        if (!filters.startDate || !filters.endDate) {
            return undefined
        }
        return {
            from: new Date(filters.startDate),
            to: new Date(filters.endDate)
        }
    }, [filters.startDate, filters.endDate])

    const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
        if (range?.from) {
            setFilter('startDate', format(range.from, 'yyyy-MM-dd'))
            setFilter('endDate', range.to ? format(range.to, 'yyyy-MM-dd') : format(range.from, 'yyyy-MM-dd'))
        } else {
            setFilter('startDate', undefined)
            setFilter('endDate', undefined)
        }
    }

    const hasActiveFilters = Object.values(filters).some(value =>
        value !== undefined && value !== '' && value !== 1 && value !== 10
    )

    return (
        <div className="space-y-4">
            {/* Header con acciones */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtros de Búsqueda</h3>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        disabled={isLoading}
                        className="text-muted-foreground"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {/* Búsqueda principal */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Buscar por email, nombre o número de documento..."
                    value={filters.search || ''}
                    onChange={(e) => setFilter('search', e.target.value)}
                    disabled={isLoading}
                    className="pl-10 pr-10"
                />
                {filters.search && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setFilter('search', '')}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Filtros en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estado */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Estado
                    </label>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => setFilter('status', value === 'all' ? undefined : value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Configuración de Pago */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Tipo de Pago
                    </label>
                    <Select
                        value={filters.paymentConfigId || 'all'}
                        onValueChange={(value) => setFilter('paymentConfigId', value === 'all' ? undefined : value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos los tipos" />
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
                </div>

                {/* Ordenamiento */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Ordenar por
                    </label>
                    <Select
                        value={filters.sortBy || 'createdAt'}
                        onValueChange={(value) => setFilter('sortBy', value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="createdAt">Fecha de creación</SelectItem>
                            <SelectItem value="amount">Monto</SelectItem>
                            <SelectItem value="status">Estado</SelectItem>
                            <SelectItem value="updatedAt">Última actualización</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dirección de ordenamiento */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Dirección
                    </label>
                    <Select
                        value={filters.sortOrder || 'DESC'}
                        onValueChange={(value) => setFilter('sortOrder', value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DESC">Descendente</SelectItem>
                            <SelectItem value="ASC">Ascendente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Filtro de fechas */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                    Rango de fechas
                </label>
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                    disabled={isLoading}
                    placeholder="Seleccionar rango de fechas"
                />
            </div>
        </div>
    )
}