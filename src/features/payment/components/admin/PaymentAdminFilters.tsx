'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Search,
    X,
    RotateCcw,
    Settings2,
    ChevronUp,
    ChevronDown,
    CalendarIcon,
    SortAsc,
    SortDesc
} from 'lucide-react'
import { usePaymentAdminFiltersStore } from '../../stores/payment-filters.store'
import { PAYMENT_STATUS_LABELS } from '../../constants/payments.constants'

interface PaymentAdminFiltersProps {
    paymentConfigs: Array<{ id: number; name: string }>
    isLoading?: boolean
}

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'amount', label: 'Monto' },
    { value: 'status', label: 'Estado' },
    { value: 'updatedAt', label: 'Última actualización' },
]

export function PaymentAdminFilters({ paymentConfigs, isLoading = false }: PaymentAdminFiltersProps) {
    const { filters, setFilter, setFilters, resetFilters } = usePaymentAdminFiltersStore()
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    // Verificar si hay filtros activos (excluyendo paginación y ordenamiento por defecto)
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
        if (key === 'page' || key === 'limit') return false
        if (key === 'sortBy' && value === 'createdAt') return false
        if (key === 'sortOrder' && value === 'DESC') return false
        return value !== undefined && value !== '' && value !== null
    })

    // Verificar si hay filtros avanzados activos (sin incluir search y sort)
    const hasAdvancedFilters = Boolean(
        filters.status ||
        filters.paymentConfigId ||
        filters.startDate ||
        filters.endDate
    )

    const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
        if (range?.from) {
            setFilter('startDate', format(range.from, 'yyyy-MM-dd'))
            setFilter('endDate', range.to ? format(range.to, 'yyyy-MM-dd') : format(range.from, 'yyyy-MM-dd'))
        } else {
            setFilter('startDate', undefined)
            setFilter('endDate', undefined)
        }
    }

    const handleSortChange = (value: string) => {
        const currentSortBy = filters.sortBy || 'createdAt'
        const currentOrder = filters.sortOrder || 'DESC'

        if (value === currentSortBy) {
            // Cambiar orden si es el mismo campo
            setFilter('sortOrder', currentOrder === 'ASC' ? 'DESC' : 'ASC')
        } else {
            // Nuevo campo, orden por defecto DESC
            setFilters({
                sortBy: value as any,
                sortOrder: 'DESC'
            })
        }
    }

    const dateRange = filters.startDate ? {
        from: new Date(filters.startDate),
        to: filters.endDate ? new Date(filters.endDate) : new Date(filters.startDate)
    } : undefined

    return (
        <div className="space-y-4">
            {/* Sección principal: Búsqueda y controles básicos */}
            <div className="space-y-3">
                {/* Búsqueda principal */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                            className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
                            onClick={() => setFilter('search', '')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Controles de la segunda fila */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Ordenamiento */}
                    <div className="flex gap-2 flex-1 w-full sm:w-auto">
                        <Select
                            value={filters.sortBy || 'createdAt'}
                            onValueChange={handleSortChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <div className="flex items-center gap-2">
                                    {filters.sortOrder === 'ASC' ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )}
                                    <SelectValue placeholder="Ordenar por" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {SORT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white" />
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
                                onClick={() => {
                                    setFilter('status', undefined)
                                    setFilter('paymentConfigId', undefined)
                                    setFilter('startDate', undefined)
                                    setFilter('endDate', undefined)
                                }}
                                disabled={isLoading}
                                className="text-muted-foreground text-xs"
                            >
                                <X className="h-3 w-3 mr-1" />
                                Limpiar filtros avanzados
                            </Button>
                        )}
                    </div>

                    {/* Grid de filtros avanzados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                        {/* Tipo de Pago */}
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

                        {/* Rango de fechas */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Rango de fechas
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal ${!dateRange ? "text-muted-foreground" : ""
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
                                                    e.stopPropagation()
                                                    handleDateRangeChange(undefined)
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
    )
}