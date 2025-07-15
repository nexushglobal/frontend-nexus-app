import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MembershipPlansLoading() {
    return (
        <div className="space-y-8">
            {/* Current Membership Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Card className="shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-20" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </div>
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>

            {/* Plans Grid Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-56" />
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="shadow-sm">
                            <CardHeader>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-4 flex-1" />
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}