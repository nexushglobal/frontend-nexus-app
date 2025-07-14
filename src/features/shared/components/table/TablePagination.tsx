'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface TablePaginationProps {
    pagination: PaginationInfo
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
    isLoading?: boolean
    compact?: boolean // Opción para versión más compacta
}

export function TablePagination({
    pagination,
    onPageChange,
    onLimitChange,
    isLoading = false,
    compact = false
}: TablePaginationProps) {
    const { page, limit, total, totalPages } = pagination

    const startItem = Math.min((page - 1) * limit + 1, total)
    const endItem = Math.min(page * limit, total)

    const canGoPrevious = page > 1
    const canGoNext = page < totalPages

    // Si solo hay una página y no hay registros, mostrar mensaje simple
    if (totalPages <= 1 && total === 0) {
        return (
            <div className="flex justify-center py-4">
                <p className="text-sm text-muted-foreground">No hay registros para mostrar</p>
            </div>
        )
    }

    // Versión compacta para móviles
    if (compact) {
        return (
            <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {total > 0 ? `${startItem}-${endItem} de ${total}` : 'Sin registros'}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(page - 1)}
                            disabled={!canGoPrevious || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="px-3 text-sm font-medium min-w-[60px] text-center">
                            {page} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(page + 1)}
                            disabled={!canGoNext || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar</span>
                    <Select
                        value={limit.toString()}
                        onValueChange={(value) => onLimitChange(Number(value))}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        )
    }

    return (
        <div className="">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-4 p-4 sm:hidden">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {total > 0 ? `${startItem}-${endItem} de ${total}` : 'Sin registros'}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filas</span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => onLimitChange(Number(value))}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                        disabled={!canGoPrevious || isLoading}
                        className="flex-1 max-w-[100px]"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>

                    <div className="px-4 py-2 text-sm font-medium bg-muted rounded-md min-w-[80px] text-center">
                        {page} / {totalPages}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={!canGoNext || isLoading}
                        className="flex-1 max-w-[100px]"
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:items-center sm:justify-between p-4">
                <div className="flex items-center gap-6">
                    <div className="text-sm text-muted-foreground">
                        Mostrando <span className="font-medium">{startItem}</span> a{' '}
                        <span className="font-medium">{endItem}</span> de{' '}
                        <span className="font-medium">{total}</span> registros
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Filas por página</span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => onLimitChange(Number(value))}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium mr-4">
                        Página {page} de {totalPages}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(1)}
                            disabled={!canGoPrevious || isLoading}
                            title="Primera página"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(page - 1)}
                            disabled={!canGoPrevious || isLoading}
                            title="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(page + 1)}
                            disabled={!canGoNext || isLoading}
                            title="Página siguiente"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onPageChange(totalPages)}
                            disabled={!canGoNext || isLoading}
                            title="Última página"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}