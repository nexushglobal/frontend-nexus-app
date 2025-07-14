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
}

export function TablePagination({
    pagination,
    onPageChange,
    onLimitChange,
    isLoading = false
}: TablePaginationProps) {
    const { page, limit, total, totalPages } = pagination

    const startItem = Math.min((page - 1) * limit + 1, total)
    const endItem = Math.min(page * limit, total)

    const canGoPrevious = page > 1
    const canGoNext = page < totalPages

    return (
        <div className="flex items-center justify-between space-x-6 lg:space-x-8 px-2">
            <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                    Mostrando {startItem} - {endItem} de {total} resultados
                </p>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Filas por página</p>
                    <Select
                        value={limit.toString()}
                        onValueChange={(value) => onLimitChange(Number(value))}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit.toString()} />
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

                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {page} de {totalPages}
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8  lg:flex"
                        onClick={() => onPageChange(1)}
                        disabled={!canGoPrevious || isLoading}
                    >
                        <span className="sr-only hidden">Ir a la primera página</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onPageChange(page - 1)}
                        disabled={!canGoPrevious || isLoading}
                    >
                        <span className="sr-only hidden">Ir a la página anterior</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onPageChange(page + 1)}
                        disabled={!canGoNext || isLoading}
                    >
                        <span className="sr-only hidden">Ir a la página siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 lg:flex"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!canGoNext || isLoading}
                    >
                        <span className="sr-only hidden">Ir a la última página</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}