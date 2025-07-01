import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentDetailLoading() {
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Loading */}
            <div className="col-span-12 md:col-span-3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Loading */}
            <div className="col-span-12 md:col-span-9">
                <div className="space-y-6">
                    {/* Header Card */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="text-center">
                                        <Skeleton className="h-4 w-16 mx-auto mb-2" />
                                        <Skeleton className="h-6 w-20 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Cards */}
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, lineIndex) => (
                                        <div key={lineIndex} className="flex justify-between">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}