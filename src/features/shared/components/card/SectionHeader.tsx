"use client";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    title: string;
    icon: LucideIcon;
    completionPercentage?: number;
    showProgress?: boolean;
    actionButton?: ReactNode;
    className?: string;
}

export function SectionHeader({
    title,
    icon: Icon,
    completionPercentage = 0,
    showProgress = false,
    actionButton,
    className
}: Props) {
    return (
        <CardHeader className={cn("flex flex-row items-center justify-between pb-4", className)}>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {showProgress && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {completionPercentage}% completo
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {actionButton}
        </CardHeader>
    );
}