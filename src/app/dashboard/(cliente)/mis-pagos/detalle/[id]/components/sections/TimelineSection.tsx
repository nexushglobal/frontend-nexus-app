import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailResponse } from "../../actions";
import {
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Edit,
    User,
    History
} from "lucide-react";
import { formatDateTime } from "@/lib/formatters";

interface TimelineSectionProps {
    payment: PaymentDetailResponse;
}

export function TimelineSection({ payment }: TimelineSectionProps) {
    const timelineEvents = [
        {
            id: 1,
            type: "created",
            title: "Pago Creado",
            description: `Pago iniciado con método ${payment.paymentMethod}`,
            timestamp: payment.createdAt,
            icon: Plus,
            status: "completed"
        },
        ...(payment.updatedAt !== payment.createdAt ? [{
            id: 2,
            type: "updated",
            title: "Información Actualizada",
            description: "Los datos del pago fueron modificados",
            timestamp: payment.updatedAt,
            icon: Edit,
            status: "completed"
        }] : []),
        ...(payment.reviewedAt ? [{
            id: 3,
            type: "reviewed",
            title: payment.status === "APPROVED" ? "Pago Aprobado" : payment.status === "REJECTED" ? "Pago Rechazado" : "Pago Revisado",
            description: `Revisado por ${payment.reviewedByEmail || 'Sistema'}`,
            timestamp: payment.reviewedAt,
            icon: payment.status === "APPROVED" ? CheckCircle : payment.status === "REJECTED" ? XCircle : User,
            status: payment.status === "APPROVED" ? "success" : payment.status === "REJECTED" ? "error" : "info"
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
                                    {event.type === "reviewed" && payment.rejectionReason && (
                                        <div className="mt-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                                            <p className="text-sm text-destructive font-medium mb-1">Motivo del rechazo:</p>
                                            <p className="text-sm text-destructive/80">{payment.rejectionReason}</p>
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
                            payment.status === "APPROVED" ? "success" :
                                payment.status === "REJECTED" ? "error" : "info"
                        ).bgColor}`}>
                            {payment.status === "APPROVED" ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : payment.status === "REJECTED" ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                            ) : (
                                <Clock className="h-5 w-5 text-warning" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-foreground">Estado Actual</p>
                            <p className="text-sm text-muted-foreground">
                                {payment.status === "APPROVED" ? "El pago ha sido aprobado exitosamente" :
                                    payment.status === "REJECTED" ? "El pago fue rechazado y requiere atención" :
                                        "El pago está pendiente de revisión"}
                            </p>
                        </div>
                        <Badge className={`${getStatusConfig(
                            payment.status === "APPROVED" ? "success" :
                                payment.status === "REJECTED" ? "error" : "info"
                        ).bgColor} ${getStatusConfig(
                            payment.status === "APPROVED" ? "success" :
                                payment.status === "REJECTED" ? "error" : "info"
                        ).iconColor} border-0`}>
                            {payment.status === "APPROVED" ? "Aprobado" :
                                payment.status === "REJECTED" ? "Rechazado" : "Pendiente"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}