'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Filter,
    Loader2,
    RotateCcw,
    Search,
    Settings2,
    SortAsc,
    SortDesc
} from 'lucide-react'
import { usePaymentFilters } from '../../hooks/usePaymentFilters'
import { PAYMENT_STATUS_LABELS, SORT_OPTIONS } from '../../constants/payments.constants'
import { PaymentStatus } from '../../types/enums-payments'
import { PaymentConfig } from '../../types/response-payment'

interface PaymentsTableFiltersProps {
    search: string
    status: PaymentStatus | undefined
    paymentConfigId: number | undefined
    startDate: string | undefined
    endDate: string | undefined
    sortBy: string
    sortOrder: 'ASC' | 'DESC'
    paymentConfigs: PaymentConfig[]
}

export function PaymentsTableFilters(props: PaymentsTableFiltersProps) {
    const {
        searchValue,
        statusValue,
        paymentConfigValue,
        sortByValue,
        sortOrderValue,
        dateRange,
        hasActiveFilters,
        showAdvancedFilters,
        isLoading,
        setStatusValue,
        setPaymentConfigValue,
        setDateRange,
        setShowAdvancedFilters,
        applyFilters,
        resetFilters,
        handleSearchChange,
        handleSortChange,
    } = usePaymentFilters(props)

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
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar pagos..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex gap-2 flex-1 w-full sm:w-auto">
                        <Select
                            value={sortByValue}
                            onValueChange={(value) => handleSortChange(value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <div className="flex items-center gap-2">
                                    {sortOrderValue === 'ASC' ? (
                                        <SortAsc className="h-4 w-4" />
                                    ) : (
                                        <SortDesc className="h-4 w-4" />
                                    )}
                                    <SelectValue placeholder="Ordenar" />
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
                            {hasActiveFilters && (
                                <Badge
                                    variant="secondary"
                                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600 text-white"
                                >
                                    {Object.values({
                                        search: searchValue.trim() !== '',
                                        status: statusValue !== 'all',
                                        config: paymentConfigValue !== 'all',
                                        date: dateRange.from || dateRange.to
                                    }).filter(Boolean).length}
                                </Badge>
                            )}
                        </Button>

                        <Button
                            onClick={applyFilters}
                            size="sm"
                            className="flex-1 sm:flex-initial"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                            ) : (
                                <Filter className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">
                                {isLoading ? 'Aplicando...' : 'Aplicar'}
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

            {showAdvancedFilters && (
                <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Filtros avanzados
                            </span>
                        </div>
                        <div className="sm:hidden">
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    disabled={isLoading}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Estado */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Estado
                            </label>
                            <Select
                                value={statusValue}
                                onValueChange={setStatusValue}
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
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Tipo de Pago
                            </label>
                            <Select
                                value={paymentConfigValue}
                                onValueChange={setPaymentConfigValue}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los tipos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {props.paymentConfigs.map((config) => (
                                        <SelectItem key={config.id} value={config.id.toString()}>
                                            {config.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Fecha Desde */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Fecha Desde
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        disabled={isLoading}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {dateRange.from ? (
                                            format(dateRange.from, "dd/MM/yyyy", { locale: es })
                                        ) : (
                                            <span className="text-gray-500">Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={dateRange.from}
                                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha Hasta */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Fecha Hasta
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        disabled={isLoading}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {dateRange.to ? (
                                            format(dateRange.to, "dd/MM/yyyy", { locale: es })
                                        ) : (
                                            <span className="text-gray-500">Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={dateRange.to}
                                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
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