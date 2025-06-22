"use client";

import { cn } from "@/lib/utils";
interface Props {
    title: string;
    icon?: string;
    items: string[];
    variant?: "default" | "info" | "warning" | "success" | "destructive";
    className?: string;
}

const variants = {
    default: "bg-muted/30 border-border/50",
    info: "bg-info/5 border-info/20",
    warning: "bg-warning/5 border-warning/20",
    success: "bg-success/5 border-success/20",
    destructive: "bg-destructive/5 border-destructive/20",
};

export function InfoCard({
    title,
    icon,
    items,
    variant = "default",
    className
}: Props) {
    return (
        <div className={cn(
            "rounded-lg p-4 border",
            variants[variant],
            className
        )}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {icon && `${icon} `}{title}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
                {items.map((item, index) => (
                    <li key={index}>• {item}</li>
                ))}
            </ul>
        </div>
    );
}