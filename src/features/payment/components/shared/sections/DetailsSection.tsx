import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/features/payment/utils/payement.utils";
import {
    AlertTriangle,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Hash,
    User,
    XCircle
} from "lucide-react";

interface DetailsSectionProps {
    operationCode?: string | null;
    bankName?: string | null;
    operationDate?: string | null;
    ticketNumber?: string | null;
    externalReference?: string | null;
    gatewayTransactionId?: string | null;
    reviewedByEmail?: string | null;
    reviewedAt?: string | null;
    createdAt: string
    updatedAt: string
    rejectionReason?: string | null;
}

export function DetailsSection({
    operationCode,
    bankName,
    operationDate,
    ticketNumber,
    reviewedAt,
    reviewedByEmail,
    gatewayTransactionId,
    externalReference,
    createdAt,
    updatedAt,
    rejectionReason
}: DetailsSectionProps) {
    return (
        <div className="space-y-3">
            {/* Compact Operation Details */}
            <Card className="p-4">
                <div className="space-y-3">
                    {operationCode && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                Código:
                            </span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {operationCode}
                            </span>
                        </div>
                    )}
                    {bankName && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Banco:
                            </span>
                            <span className="font-medium">{bankName}</span>
                        </div>
                    )}
                    {operationDate && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Fecha Op:
                            </span>
                            <span className="text-xs">{formatDateTime(operationDate).split(' ')[0]}</span>
                        </div>
                    )}
                    {ticketNumber && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Ticket:
                            </span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {ticketNumber}
                            </span>
                        </div>
                    )}
                    {externalReference && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                Ref. Externa:
                            </span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {externalReference}
                            </span>
                        </div>
                    )}
                    {gatewayTransactionId && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                Gateway ID:
                            </span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {gatewayTransactionId}
                            </span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Compact Review Info */}
            {(reviewedByEmail || reviewedAt || rejectionReason) && (
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        {rejectionReason ? (
                            <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm font-medium">
                            {rejectionReason ? 'Rechazado' : 'Revisado'}
                        </span>
                    </div>
                    
                    {rejectionReason && (
                        <div className="text-xs p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded mb-2">
                            <strong>Motivo:</strong> {rejectionReason}
                        </div>
                    )}
                    
                    <div className="space-y-1 text-xs">
                        {reviewedByEmail && <div>Por: {reviewedByEmail}</div>}
                        {reviewedAt && <div className="text-muted-foreground">{formatDateTime(reviewedAt).split(' ')[0]}</div>}
                    </div>
                </Card>
            )}

            {/* Compact Timestamps */}
            <Card className="p-4">
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Creado:
                        </span>
                        <span>{formatDateTime(createdAt).split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Actualizado:
                        </span>
                        <span>{formatDateTime(updatedAt).split(' ')[0]}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}