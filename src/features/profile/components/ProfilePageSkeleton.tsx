"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export function ProfilePageSkeleton() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const HeaderSkeleton = () => (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
                        <Skeleton className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" /> {/* Name */}
                            <Skeleton className="h-4 w-48" /> {/* Email */}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Skeleton className="h-6 w-20" /> {/* Completion badge */}
                            <Skeleton className="h-6 w-16" /> {/* Nickname badge */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const AlertSkeleton = () => (
        <Card className="mb-6 border-muted">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                    {!isMobile && (
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const OverviewSkeleton = () => (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-16" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                {i === 0 && <Skeleton className="h-16 w-16 rounded-full" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="flex items-start gap-3 p-2 rounded-lg border">
                                    <Skeleton className="h-4 w-4 mt-0.5" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-4" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Suggestion Card */}

        </div>
    );

    const SectionContentSkeleton = () => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-1.5 w-20 rounded-full" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-9 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg border">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const SidebarSkeleton = () => (
        <Card>
            <CardHeader>
                <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-1">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="px-4 py-3 flex items-center gap-3">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-20" />
                                    {i < 3 && <Skeleton className="h-3 w-3" />} {/* Warning icon */}
                                </div>
                                <Skeleton className="h-3 w-32" />
                            </div>
                            {i === 0 && <Skeleton className="h-4 w-4" />} {/* Check icon */}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const MobileTabsSkeleton = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-4 w-full gap-2 bg-muted p-1 rounded-lg">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-md" />
                ))}
            </div>

            <SectionContentSkeleton />
        </div>
    );

    const MobileMoreSkeleton = () => (
        <div className="grid grid-cols-2 gap-2 mt-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 border rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/30">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    );

    if (isMobile) {
        return (
            <div className="container mx-auto p-4 space-y-6 animate-pulse">
                <HeaderSkeleton />
                <AlertSkeleton />
                <MobileTabsSkeleton />
                <MobileMoreSkeleton />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6 animate-pulse">
            <HeaderSkeleton />

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar Skeleton */}
                <div className="col-span-3">
                    <SidebarSkeleton />
                </div>

                {/* Main Content Skeleton */}
                <div className="col-span-9">
                    <OverviewSkeleton />
                </div>
            </div>
        </div>
    );
}