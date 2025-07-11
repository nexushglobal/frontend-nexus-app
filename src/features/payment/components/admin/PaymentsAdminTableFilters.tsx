'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Search,
    Filter,
    Settings2,
    RotateCcw,
    SortAsc,
    SortDesc,
    Loader2,
    CalendarIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAdminPaymentFilters } from '../../hooks/useAdminPaymentFilters'
import { PaymentSearchParams } from '../../schemas/payment-search-params.schema'
import { PaymentConfig } from '../../types/response-payment'
import { PAYMENT_STATUS_LABELS } from '../../constants/payments.constants'

interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Fecha de creación' },
    { value: 'amount', label: 'Monto' },
    { value: 'status', label: 'Estado' },
    { value: 'updatedAt', label: 'Última actualización' },
]

interface PaymentsAdminTableFiltersProps extends PaymentSearchParams {
    paymentConfigs: PaymentConfig[]
}

export function PaymentsAdminTableFilters({
    paymentConfigs,
    ...initialParams
}: PaymentsAdminTableFiltersProps) {
    const {
        searchValue,
        setSearchValue,
        statusValue,
        setStatusValue,
        paymentConfigValue,
        setPaymentConfigValue,
        sortByValue,
        setSortByValue,
        sortOrderValue,
        setSortOrderValue,
        dateRange,
        setDateRange,
        showAdvancedFilters,
        setShowAdvancedFilters,
        handleSearchChange,
        handleSortChange,
        applyFilters,
        resetFilters,
        hasActiveFilters,
        isLoading
    } = useAdminPaymentFilters(initialParams)

    return (
        <div className="space-y-4">
            {hasActiveFilters && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Filtros aplicados
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            disabled={isLoading}
                        >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Limpiar
                        </Button>
                    </div>
                </div>
            )}

            <div className="relative p-3 sm:p-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Buscar pagos por cliente, email, documento..."
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
                            {showAdvancedFilters ?
                                <span className="sm:hidden">Menos</span> :
                                <span className="sm:hidden">Más</span>
                            }
                        </Button>

                        <Button
                            onClick={applyFilters}
                            size="sm"
                            disabled={isLoading}
                            className="flex items-center gap-2 flex-1 sm:flex-initial"
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
                                    {paymentConfigs.map((config) => (
                                        <SelectItem key={config.id} value={config.id.toString()}>
                                            {config.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Fecha de inicio */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Fecha desde
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dateRange.from && "text-muted-foreground"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from ? (
                                            format(dateRange.from, "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.from}
                                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Fecha de fin */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Fecha hasta
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dateRange.to && "text-muted-foreground"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.to ? (
                                            format(dateRange.to, "PPP", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.to}
                                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                                        initialFocus
                                        locale={es}
                                        disabled={(date) =>
                                            dateRange.from ? date < dateRange.from : false
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={applyFilters}
                            size="sm"
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Aplicando filtros...
                                </>
                            ) : (
                                <>
                                    <Filter className="h-4 w-4" />
                                    Aplicar filtros
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}