import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PaymentsTableSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filtros skeleton */}
            <Card className="shadow-sm">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {/* Barra de búsqueda */}
                        <Skeleton className="h-10 w-full" />

                        {/* Botones de filtros */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <Skeleton className="h-10 w-full sm:w-[180px]" />
                            <div className="flex gap-2 sm:gap-3 sm:ml-auto">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla skeleton - Desktop */}
            <div className="hidden md:block">
                <Card className="border-gray-200 shadow-sm dark:border-gray-800">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <th key={index} className="p-4 text-left">
                                                <Skeleton className="h-4 w-24" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                                        <tr key={rowIndex} className="border-b">
                                            {Array.from({ length: 6 }).map((_, colIndex) => (
                                                <td key={colIndex} className="p-4">
                                                    <Skeleton className="h-6 w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cards skeleton - Mobile */}
            <div className="md:hidden space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-12" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-3 w-12" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Paginación skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                </div>
            </div>
        </div>
    )
}