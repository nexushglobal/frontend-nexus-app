'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading?: boolean
    onSortingChange?: (sorting: SortingState) => void
    sorting?: SortingState
    className?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading = false,
    onSortingChange,
    sorting = [],
    className
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
        state: {
            sorting: onSortingChange ? sorting : internalSorting,
        },
        manualSorting: !!onSortingChange, // Sorting manual si se proporciona callback
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
                            {table.getHeaderGroups().map((headerGroup) => (
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
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {isLoading ? 'Cargando...' : 'No hay resultados.'}
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