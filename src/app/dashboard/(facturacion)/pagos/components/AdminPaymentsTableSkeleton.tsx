// src/app/dashboard/(facturacion)/pagos/components/AdminPaymentsTableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export default function AdminPaymentsTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filtros skeleton */}
            <Card className="shadow-sm">
                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex gap-2 sm:gap-3 sm:ml-auto">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-28" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabla skeleton - visible en desktop */}
            <Card className="hidden md:block border-gray-200 shadow-sm dark:border-gray-800">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Skeleton className="h-5 w-16" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-24" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-16" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-16" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-20" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-24" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-20" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-5 w-20" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array(8)
                                    .fill(0)
                                    .map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-12" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-24" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-20" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-3 w-12" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-8 w-24" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            {/* Cards skeleton - visible en mobile */}
            <div className="md:hidden space-y-4">
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <Card key={i} className="shadow-sm">
                            <div className="p-4">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-6 w-20" />
                                </div>

                                {/* Usuario */}
                                <div className="flex items-center gap-3 mb-3">
                                    <Skeleton className="h-10 w-10 rounded-lg" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>

                                {/* Monto */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-5 w-20" />
                                </div>

                                {/* Método y Configuración */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <Skeleton className="h-3 w-20 mb-1" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    </div>
                                    <div>
                                        <Skeleton className="h-3 w-20 mb-1" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fecha */}
                                <div className="mb-3">
                                    <Skeleton className="h-3 w-24 mb-1" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Skeleton className="h-8 flex-1" />
                                </div>
                            </div>
                        </Card>
                    ))}
            </div>

            {/* Paginación skeleton */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                    <Skeleton className="h-8 w-8" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-24 ml-2" />
                </div>
            </div>
        </div>
    );
}