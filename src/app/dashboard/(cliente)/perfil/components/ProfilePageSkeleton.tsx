"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
                    <div className="relative">
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
                            <Skeleton className="h-6 w-16" /> {/* Active badge */}
                            <Skeleton className="h-6 w-20" /> {/* Nickname badge */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const OverviewSkeleton = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-5 w-5" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const SectionContentSkeleton = () => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-8 w-8" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const SidebarSkeleton = () => (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-1">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="px-4 py-3 flex items-center gap-3">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
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
                <div key={i} className="h-20 border rounded-lg flex flex-col items-center justify-center gap-2 bg-muted/50">
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