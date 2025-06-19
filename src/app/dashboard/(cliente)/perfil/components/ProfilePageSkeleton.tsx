import { Skeleton } from "@/components/ui/skeleton";

export function ProfilePageSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative">
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Referral Code Skeleton */}
            <div className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}