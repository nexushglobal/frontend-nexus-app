"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, AlertCircle, CheckCircle } from "lucide-react";

interface ProfileInfoFieldProps {
    label: string;
    value: string;
    icon: LucideIcon;
    isComplete?: boolean;
    showStatus?: boolean;
    className?: string;
    maskValue?: boolean; // Para datos sensibles como números de cuenta
    maskPattern?: "account" | "cci" | "ruc"; // Patrones predefinidos de enmascaramiento
}

export function ProfileInfoField({
    label,
    value,
    icon: Icon,
    isComplete = true,
    showStatus = false,
    className,
    maskValue = false,
    maskPattern
}: ProfileInfoFieldProps) {

    const getMaskedValue = (value: string, pattern?: string) => {
        if (!maskValue || !value) return value;

        switch (pattern) {
            case "account":
                return value.length > 4 ? `****${value.slice(-4)}` : value;
            case "cci":
                return value.length > 4 ? `****************${value.slice(-4)}` : value;
            case "ruc":
                return value.length > 4 ? `****${value.slice(-4)}` : value;
            default:
                return value.length > 4 ? `****${value.slice(-4)}` : value;
        }
    };

    const displayValue = getMaskedValue(value, maskPattern);

    return (
        <div className={cn(
            "flex items-center gap-2 p-2.5 rounded-lg border bg-card",
            className
        )}>
            <Icon className={cn(
                "h-4 w-4 flex-shrink-0",
                isComplete ? "text-primary" : "text-muted-foreground"
            )} />

            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <p className={cn(
                        "text-sm font-medium truncate",
                        isComplete ? "text-foreground" : "text-muted-foreground italic"
                    )}>
                        {displayValue || "No especificado"}
                    </p>

                    {maskValue && value && (
                        <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                            Oculto por seguridad
                        </span>
                    )}
                </div>
            </div>

            {showStatus && (
                <div className="flex-shrink-0">
                    {isComplete ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            )}
        </div>
    );
}