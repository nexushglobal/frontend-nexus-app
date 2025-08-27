import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="container">
            {/* Page Header */}
            <div className="mb-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Filters Card */}
            <Card className="shadow-sm mb-6">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </div>
                </CardContent>
            </Card>

            {/* Table/Cards Container */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <Card className="shadow-sm mt-6">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}