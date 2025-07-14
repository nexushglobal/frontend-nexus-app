'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon, Filter, Loader2, RotateCcw, Search, Settings2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { usePaymentUserFiltersStore } from '../../stores/payment-filters.store'
import { PAYMENT_STATUS_LABELS, PAYMENT_SORT_OPTIONS } from '../../constants/payments.constants'
import { PaymentConfig } from '../../types/response-payment'

interface PaymentUserFiltersProps {
    paymentConfigs: PaymentConfig[]
    isLoading?: boolean
}

export function PaymentUserFilters({ paymentConfigs, isLoading = false }: PaymentUserFiltersProps) {
    const { filters, setFilter, resetFilters } = usePaymentUserFiltersStore()
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

    const [searchValue, setSearchValue] = useState(filters.search || '')

    const hasActiveFilters = useMemo(() => {
        return !!(
            filters.search ||
            filters.status ||
            filters.paymentConfigId ||
            filters.startDate ||
            filters.endDate
        )
    }, [filters])

    // Verificar si hay filtros avanzados activos
    const hasAdvancedFilters = useMemo(() => {
        return !!(
            filters.status ||
            filters.paymentConfigId ||
            filters.startDate ||
            filters.endDate
        )
    }, [filters])

    const handleSearch = () => {
        setFilter('search', searchValue.trim() || undefined)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-')
        setFilter('sortBy', sortBy)
        setFilter('sortOrder', sortOrder as 'ASC' | 'DESC')
    }

    const currentSortValue = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'DESC'}`

    return (
        <div className="space-y-4">
            {/* Filtros principales */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Búsqueda */}
                <div className="md:col-span-6 lg:col-span-5 xl:col-span-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por descripción, monto o referencia..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="pl-10"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Ordenamiento */}
                <div className="md:col-span-3 lg:col-span-3 xl:col-span-3">
                    <Select
                        value={currentSortValue}
                        onValueChange={handleSortChange}
                        disabled={isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Ordenar por..." />
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_SORT_OPTIONS.map((option) => (
                                <>
                                    <SelectItem key={`${option.value}-DESC`} value={`${option.value}-DESC`}>
                                        {option.label} (Desc)
                                    </SelectItem>
                                    <SelectItem key={`${option.value}-ASC`} value={`${option.value}-ASC`}>
                                        {option.label} (Asc)
                                    </SelectItem>
                                </>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Botones de acción */}
                <div className="md:col-span-3 lg:col-span-4 xl:col-span-5">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                            ) : (
                                <Search className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">Buscar</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            disabled={isLoading}
                            className="flex-1 sm:flex-none"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                            ) : (
                                <Filter className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">
                                {showAdvancedFilters ? 'Ocultar filtros' : 'Más filtros'}
                            </span>
                        </Button>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="hidden sm:flex"
                                disabled={isLoading}
                            >
                                <RotateCcw className="h-4 w-4" />
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
                                value={filters.paymentConfigId?.toString() || 'all'}
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

                        {/* Fecha desde */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Fecha desde
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.startDate && "text-muted-foreground"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.startDate ? (
                                            format(new Date(filters.startDate), "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={filters.startDate ? new Date(filters.startDate) : undefined}
                                        onSelect={(date) => setFilter('startDate', date?.toISOString().split('T')[0])}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha hasta */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Fecha hasta
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.endDate && "text-muted-foreground"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.endDate ? (
                                            format(new Date(filters.endDate), "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={filters.endDate ? new Date(filters.endDate) : undefined}
                                        onSelect={(date) => setFilter('endDate', date?.toISOString().split('T')[0])}
                                        initialFocus
                                        locale={es}
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