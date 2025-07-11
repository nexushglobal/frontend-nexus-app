import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    XCircle,
    Copy,
    ExternalLink,
    Archive,
    Globe
} from "lucide-react";
import { toast } from "sonner";

interface AdminDetailsSectionProps {
    operationCode?: string | null;
    bankName?: string | null;
    operationDate?: string | null;
    ticketNumber?: string | null;
    externalReference?: string | null;
    gatewayTransactionId?: string | null;
    reviewedByEmail?: string | null;
    reviewedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    rejectionReason?: string | null;
    isArchived: boolean;
    relatedEntityType: string;
    relatedEntityId: string;
}

export function AdminDetailsSection({
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
    rejectionReason,
    isArchived,
    relatedEntityType,
    relatedEntityId
}: AdminDetailsSectionProps) {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
    };

    return (
        <div className="space-y-6">
            {/* Operation Details */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3 text-card-foreground">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        Detalles de la Operación
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {operationCode && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <Hash className="field-icon text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="section-title">Código de Operación</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(operationCode, "Código de operación")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {operationCode}
                                    </p>
                                </div>
                            </div>
                        )}

                        {bankName && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-secondary/10">
                                    <Building2 className="field-icon text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Banco</p>
                                    <p className="text-sm font-medium text-foreground">{bankName}</p>
                                </div>
                            </div>
                        )}

                        {ticketNumber && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-info/10">
                                    <FileText className="field-icon text-info" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="section-title">Número de Ticket</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(ticketNumber, "Número de ticket")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                        {ticketNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {operationDate && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <Calendar className="field-icon text-warning" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="section-title">Fecha de Operación</p>
                                    <p className="text-sm font-medium text-foreground">{formatDateTime(operationDate)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Technical Information */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        Información Técnica
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {gatewayTransactionId && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <Hash className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="section-title">ID de Transacción Gateway</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(gatewayTransactionId, "ID de transacción")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="font-mono text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-md border break-all">
                                        {gatewayTransactionId}
                                    </p>
                                </div>
                            </div>
                        )}

                        {externalReference && (
                            <div className="info-field">
                                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
                                    <ExternalLink className="h-4 w-4 text-teal-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="section-title">Referencia Externa</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleCopy(externalReference, "Referencia externa")}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="font-mono text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-md border break-all">
                                        {externalReference}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                                <FileText className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="section-title">Tipo de Entidad Relacionada</p>
                                <p className="text-sm font-medium text-foreground">{relatedEntityType}</p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                                <Hash className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="section-title">ID de Entidad Relacionada</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopy(relatedEntityId, "ID de entidad")}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="font-mono text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-md border">
                                    {relatedEntityId}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(reviewedAt || reviewedByEmail) && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                            Información de Revisión
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {reviewedByEmail && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                        <User className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="section-title">Revisado por</p>
                                        <p className="text-sm font-medium text-foreground">{reviewedByEmail}</p>
                                    </div>
                                </div>
                            )}

                            {reviewedAt && (
                                <div className="info-field">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="section-title">Fecha de Revisión</p>
                                        <p className="text-sm font-medium text-foreground">{formatDateTime(reviewedAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status Information */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Archive className="h-5 w-5 text-gray-600" />
                        </div>
                        Estado del Registro
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Archive className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Estado de Archivo</p>
                                <p className="text-sm text-muted-foreground">
                                    {isArchived ? "Este pago está archivado" : "Este pago está activo"}
                                </p>
                            </div>
                        </div>
                        <Badge variant={isArchived ? "secondary" : "default"}>
                            {isArchived ? "Archivado" : "Activo"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="section-title">Fecha de Creación</p>
                                <p className="text-sm font-medium text-foreground">{formatDateTime(createdAt)}</p>
                            </div>
                        </div>

                        <div className="info-field">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="section-title">Última Actualización</p>
                                <p className="text-sm font-medium text-foreground">{formatDateTime(updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rejection Reason (if applicable) */}
            {rejectionReason && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-3 text-destructive">
                            <div className="p-2 rounded-lg bg-destructive/10">
                                <XCircle className="h-5 w-5 text-destructive" />
                            </div>
                            Motivo de Rechazo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                            <p className="text-sm text-destructive font-medium">
                                {rejectionReason}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}