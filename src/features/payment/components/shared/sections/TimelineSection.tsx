import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/features/payment/utils/payement.utils";
import {
    CheckCircle,
    Clock,
    Edit,
    History,
    Plus,
    User,
    XCircle
} from "lucide-react";

interface TimelineSectionProps {
    createdAt: string;
    updatedAt: string;
    reviewedAt: string | null;
    reviewedByEmail: string | null;
    status: string;
    paymentMethod: string;
    rejectionReason?: string | null;
}

export function TimelineSection({
    createdAt,
    updatedAt,
    reviewedAt,
    reviewedByEmail,
    status,
    paymentMethod,
    rejectionReason
}: TimelineSectionProps) {
    const timelineEvents = [
        {
            id: 1,
            type: "created",
            title: "Pago Creado",
            description: `Pago iniciado con método ${paymentMethod}`,

            timestamp: createdAt,
            icon: Plus,
            status: "completed"
        },
        ...(updatedAt !== createdAt ? [{
            id: 2,
            type: "updated",
            title: "Información Actualizada",
            description: "Los datos del pago fueron modificados",
            timestamp: updatedAt,
            icon: Edit,
            status: "completed"
        }] : []),
        ...(reviewedAt ? [{
            id: 3,
            type: "reviewed",
            title: status === "APPROVED" ? "Pago Aprobado" : status === "REJECTED" ? "Pago Rechazado" : "Pago Revisado",
            description: `Revisado por ${reviewedByEmail || 'Sistema'}`,
            timestamp: reviewedAt,
            icon: status === "APPROVED" ? CheckCircle : status === "REJECTED" ? XCircle : User,
            status: status === "APPROVED" ? "success" : status === "REJECTED" ? "error" : "info"
        }] : [])
    ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
            case "success":
                return {
                    bgColor: "bg-success/10",
                    iconColor: "text-success",
                    borderColor: "border-success/20"
                };
            case "error":
                return {
                    bgColor: "bg-destructive/10",
                    iconColor: "text-destructive",
                    borderColor: "border-destructive/20"
                };
            case "info":
                return {
                    bgColor: "bg-info/10",
                    iconColor: "text-info",
                    borderColor: "border-info/20"
                };
            default:
                return {
                    bgColor: "bg-muted/10",
                    iconColor: "text-muted-foreground",
                    borderColor: "border-muted/20"
                };
        }
    };

    return (
        <Card className="p-4">
            {/* Compact Timeline */}
            <div className="space-y-3">
                {timelineEvents.map((event, index) => {
                    const Icon = event.icon;
                    const isLast = index === timelineEvents.length - 1;
                    const statusConfig = getStatusConfig(event.status);

                    return (
                        <div key={event.id} className="relative flex gap-3">
                            {/* Compact Timeline Line */}
                            {!isLast && (
                                <div className="absolute left-4 top-8 w-0.5 h-full bg-border/30"></div>
                            )}

                            {/* Compact Icon */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}>
                                <Icon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                            </div>

                            {/* Compact Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium text-foreground">{event.title}</div>
                                        <div className="text-xs text-muted-foreground">{event.description}</div>
                                        {event.type === "reviewed" && rejectionReason && (
                                            <div className="text-xs p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded mt-1">
                                                <strong>Motivo:</strong> {rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(event.timestamp).split(' ')[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Compact Current Status */}
            <div className="mt-4 pt-3 border-t">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                    <div className={`p-1.5 rounded ${getStatusConfig(
                        status === "APPROVED" ? "success" :
                            status === "REJECTED" ? "error" : "info"
                    ).bgColor}`}>
                        {status === "APPROVED" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : status === "REJECTED" ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                            <Clock className="h-4 w-4 text-orange-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">Estado Actual</div>
                        <div className="text-xs text-muted-foreground">
                            {status === "APPROVED" ? "Aprobado" :
                                status === "REJECTED" ? "Rechazado" : "Pendiente"}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}