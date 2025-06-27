// src/app/dashboard/(cliente)/mis-pagos/components/PaymentsTableSkeleton.tsx
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

export default function PaymentsTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filtros skeleton */}
            <div className="bg-card rounded-md border p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Tabla skeleton */}
            <Card>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Skeleton className="h-5 w-32" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-20" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-16" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-24" />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className="h-5 w-24" />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-10 w-10 rounded-lg" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-4" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-20" />
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
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Paginación skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-60" />
                <Skeleton className="h-8 w-60" />
            </div>
        </div>
    );
}