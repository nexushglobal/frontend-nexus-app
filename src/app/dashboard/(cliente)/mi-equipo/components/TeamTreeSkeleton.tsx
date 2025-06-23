import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TeamTreeSkeleton() {
    return (
        <div className="space-y-6">
            {/* Controls skeleton */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-24" />
                            <div className="flex gap-1">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ReactFlow container skeleton */}
            <div className="w-full h-[700px] border rounded-lg bg-background relative overflow-hidden">
                {/* Panel skeleton (top-left) */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-md border">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-32 mb-3" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                </div>

                {/* Controls skeleton (bottom-right) */}
                <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-background border rounded-lg p-2 flex flex-col gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>

                {/* Tree structure skeleton */}
                <div className="flex justify-center items-start pt-12">
                    <div className="flex flex-col items-center space-y-8">
                        {/* Root node */}
                        <Card className="w-52">
                            <CardContent className="p-4">
                                <div className="flex flex-col items-center space-y-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 w-full text-center">
                                        <Skeleton className="h-4 w-32 mx-auto" />
                                        <Skeleton className="h-3 w-24 mx-auto" />
                                        <div className="flex items-center justify-center gap-2">
                                            <Skeleton className="h-5 w-14" />
                                            <Skeleton className="h-3 w-6" />
                                        </div>
                                    </div>
                                    <div className="flex gap-1 w-full">
                                        <Skeleton className="h-7 flex-1" />
                                        <Skeleton className="h-7 flex-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Connection lines placeholder */}
                        <div className="w-0.5 h-8 bg-muted mx-auto" />

                        {/* Children level */}
                        <div className="flex items-start gap-24">
                            {/* Left child */}
                            <div className="flex flex-col items-center">
                                <Card className="w-52">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2 w-full text-center">
                                                <Skeleton className="h-4 w-28 mx-auto" />
                                                <Skeleton className="h-3 w-20 mx-auto" />
                                                <div className="flex items-center justify-center gap-2">
                                                    <Skeleton className="h-5 w-12" />
                                                    <Skeleton className="h-3 w-6" />
                                                </div>
                                            </div>
                                            <div className="flex gap-1 w-full">
                                                <Skeleton className="h-7 flex-1" />
                                                <Skeleton className="h-7 flex-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right child */}
                            <div className="flex flex-col items-center">
                                <Card className="w-52">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col items-center space-y-3">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2 w-full text-center">
                                                <Skeleton className="h-4 w-36 mx-auto" />
                                                <Skeleton className="h-3 w-22 mx-auto" />
                                                <div className="flex items-center justify-center gap-2">
                                                    <Skeleton className="h-5 w-16" />
                                                    <Skeleton className="h-3 w-6" />
                                                </div>
                                            </div>
                                            <div className="flex gap-1 w-full">
                                                <Skeleton className="h-7 flex-1" />
                                                <Skeleton className="h-7 flex-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Additional level hint */}
                        <div className="mt-8 flex items-center gap-16 opacity-50">
                            <Skeleton className="h-20 w-40 rounded-lg" />
                            <Skeleton className="h-20 w-40 rounded-lg" />
                            <Skeleton className="h-20 w-40 rounded-lg" />
                            <Skeleton className="h-20 w-40 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Background dots simulation */}
                <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-muted to-transparent" />
                </div>
            </div>
        </div>
    );
}