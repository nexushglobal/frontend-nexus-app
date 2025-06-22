"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    subtitle?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormSection({
    title,
    subtitle,
    required = false,
    children,
    className
}: FormSectionProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                    {required ? (
                        <span className="text-xs text-destructive ml-1">(requerido)</span>
                    ) : (
                        <span className="text-xs text-muted-foreground ml-1">(opcional)</span>
                    )}
                </h3>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}