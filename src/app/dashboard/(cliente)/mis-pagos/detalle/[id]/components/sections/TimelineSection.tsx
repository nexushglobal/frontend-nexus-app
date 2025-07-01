import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailResponse } from "../../actions";
import {
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Edit,
    User
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
            description: `Pago #${payment.id} creado con método ${payment.paymentMethod}`,
            timestamp: payment.createdAt,
            icon: Plus,
            status: "completed"
        },
        ...(payment.updatedAt !== payment.createdAt ? [{
            id: 2,
            type: "updated",
            title: "Pago Actualizado",
            description: "Información del pago actualizada",
            timestamp: payment.updatedAt,
            icon: Edit,
            status: "completed"
        }] : []),
        ...(payment.reviewedAt ? [{
            id: 3,
            type: "reviewed",
            title: payment.status === "APPROVED" ? "Pago Aprobado" : payment.status === "REJECTED" ? "Pago Rechazado" : "Pago Revisado",
            description: `Revisado por ${payment.reviewedByEmail}`,
            timestamp: payment.reviewedAt,
            icon: payment.status === "APPROVED" ? CheckCircle : payment.status === "REJECTED" ? XCircle : User,
            status: payment.status === "APPROVED" ? "success" : payment.status === "REJECTED" ? "error" : "info"
        }] : [])
    ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
            case "success":
                return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
            case "error":
                return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
            case "info":
                return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
            default:
                return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Cronología del Pago
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {timelineEvents.map((event, index) => {
                        const Icon = event.icon;
                        const isLast = index === timelineEvents.length - 1;

                        return (
                            <div key={event.id} className="relative flex gap-4">
                                {/* Timeline Line */}
                                {!isLast && (
                                    <div className="absolute left-5 top-10 w-0.5 h-full bg-border"></div>
                                )}

                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${getStatusColor(event.status)}`}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium">{event.title}</h4>
                                        <Badge variant="outline" className="text-xs">
                                            {formatDateTime(event.timestamp)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

