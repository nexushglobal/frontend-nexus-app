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
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <History className="h-5 w-5 text-primary" />
                    </div>
                    Cronología del Pago
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {timelineEvents.map((event, index) => {
                        const Icon = event.icon;
                        const isLast = index === timelineEvents.length - 1;
                        const statusConfig = getStatusConfig(event.status);

                        return (
                            <div key={event.id} className="relative flex gap-4">
                                {/* Timeline Line */}
                                {!isLast && (
                                    <div className="absolute left-6 top-12 w-0.5 h-full bg-border/50"></div>
                                )}

                                {/* Icon */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                                    <Icon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h4 className="font-semibold text-foreground">{event.title}</h4>
                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                                            {formatDateTime(event.timestamp)}
                                        </Badge>
                                    </div>

                                    {/* Additional context for review events */}
                                    {event.type === "reviewed" && rejectionReason && (
                                        <div className="mt-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                                            <p className="text-sm text-destructive font-medium mb-1">Motivo del rechazo:</p>
                                            <p className="text-sm text-destructive/80">{rejectionReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Current Status Summary */}
                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                        <div className={`p-2 rounded-lg ${getStatusConfig(
                            status === "APPROVED" ? "success" :
                                status === "REJECTED" ? "error" : "info"
                        ).bgColor}`}>
                            {status === "APPROVED" ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : status === "REJECTED" ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                                <Clock className="h-5 w-5 text-warning" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-foreground">Estado Actual</p>
                            <p className="text-sm text-muted-foreground">
                                {status === "APPROVED" ? "El pago ha sido aprobado exitosamente" :
                                    status === "REJECTED" ? "El pago fue rechazado y requiere atención" :
                                        "El pago está pendiente de revisión"}
                            </p>
                        </div>
                        <Badge className={`${getStatusConfig(
                            status === "APPROVED" ? "success" :
                                status === "REJECTED" ? "error" : "info"
                        ).bgColor} ${getStatusConfig(
                            status === "APPROVED" ? "success" :
                                status === "REJECTED" ? "error" : "info"
                        ).iconColor} border-0`}>
                            {status === "APPROVED" ? "Aprobado" :
                                status === "REJECTED" ? "Rechazado" : "Pendiente"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}