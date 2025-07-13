'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    OnChangeFn,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import { Loader2, Settings2 } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
    onSortingChange?: (sorting: SortingState) => void
    sorting?: SortingState
    className?: string
    columnVisibility?: VisibilityState
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>
    showColumnToggle?: boolean
    emptyMessage?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    onSortingChange,
    sorting = [],
    className,
    columnVisibility,
    onColumnVisibilityChange,
    showColumnToggle = true,
    emptyMessage = "No hay resultados."
}: DataTableProps<TData, TValue>) {
    const [internalSorting, setInternalSorting] = useState<SortingState>(sorting)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: (updaterOrValue) => {
            const value =
                typeof updaterOrValue === 'function'
                    ? updaterOrValue(onSortingChange ? sorting : internalSorting)
                    : updaterOrValue;
            if (onSortingChange) {
                onSortingChange(value);
            } else {
                setInternalSorting(value);
            }
        },
        onColumnVisibilityChange,
        state: {
            sorting: onSortingChange ? sorting : internalSorting,
            columnVisibility,
        },
        manualSorting: !!onSortingChange,
    })

    // Sincronizar sorting externo
    useEffect(() => {
        if (onSortingChange) {
            setInternalSorting(sorting)
        }
    }, [sorting, onSortingChange])

    return (
        <Card className={className}>
            <CardContent className="p-0">
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup, index) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                    {/* Control de columnas en el header, solo en la primera fila */}
                                    {index === 0 && showColumnToggle && (
                                        <TableHead className="w-[50px]">
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Settings2 className="h-4 w-4" />
                                                            <span className="sr-only">Mostrar/ocultar columnas</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[200px]">
                                                        <div className="px-2 py-1.5 text-sm font-semibold">
                                                            Mostrar columnas
                                                        </div>
                                                        {table
                                                            .getAllColumns()
                                                            .filter((column) => column.getCanHide())
                                                            .map((column) => {
                                                                // Obtener el texto del header
                                                                const columnDef = column.columnDef as ColumnDef<TData, TValue>
                                                                const header = columnDef.header

                                                                let headerText = column.id
                                                                if (typeof header === 'string') {
                                                                    headerText = header
                                                                } else if (typeof header === 'function') {
                                                                    // Para headers complejos, usar el id o un texto por defecto
                                                                    headerText = column.id
                                                                }

                                                                return (
                                                                    <DropdownMenuCheckboxItem
                                                                        key={column.id}
                                                                        className="capitalize"
                                                                        checked={column.getIsVisible()}
                                                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                    >
                                                                        {headerText}
                                                                    </DropdownMenuCheckboxItem>
                                                                )
                                                            })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableHead>
                                    )}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                        {/* Celda vacía para alinear con el header del dropdown */}
                                        {showColumnToggle && (
                                            <TableCell className="w-[50px]" />
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (showColumnToggle ? 1 : 0)}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}