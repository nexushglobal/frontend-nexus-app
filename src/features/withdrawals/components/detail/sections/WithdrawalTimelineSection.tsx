import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { WithdrawalDetail } from '../../../types/withdrawals.types';

interface WithdrawalTimelineSectionProps {
  withdrawal: WithdrawalDetail;
}

export function WithdrawalTimelineSection({ withdrawal }: WithdrawalTimelineSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30',
          label: 'Aprobado',
        };
      case 'REJECTED':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          label: 'Rechazado',
        };
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30',
          label: 'Pendiente',
        };
      default:
        return {
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30',
          label: status,
        };
    }
  };

  // Create timeline events
  const timelineEvents = [
    {
      id: 'created',
      title: 'Solicitud de Retiro Creada',
      description: `El usuario solicitó un retiro de ${withdrawal.amount.toLocaleString()} puntos`,
      date: withdrawal.createdAt,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      completed: true,
    },
  ];

  if (withdrawal.reviewedAt) {
    const statusInfo = getStatusInfo(withdrawal.status);
    timelineEvents.push({
      id: 'reviewed',
      title: `Solicitud ${statusInfo.label}`,
      description: withdrawal.rejectionReason 
        ? `Rechazado: ${withdrawal.rejectionReason}`
        : `La solicitud fue ${statusInfo.label.toLowerCase()} por el revisor`,
      date: withdrawal.reviewedAt,
      icon: statusInfo.icon,
      color: statusInfo.color,
      bgColor: statusInfo.bgColor,
      borderColor: statusInfo.borderColor,
      completed: true,
    });
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            Estado Actual del Retiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3">
              {(() => {
                const statusInfo = getStatusInfo(withdrawal.status);
                const IconComponent = statusInfo.icon;
                return (
                  <>
                    <div className={`p-3 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                      <IconComponent className={`h-6 w-6 ${statusInfo.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{statusInfo.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.status === 'PENDING' ? 'En espera de revisión' : 
                         withdrawal.status === 'APPROVED' ? 'Retiro procesado exitosamente' :
                         'Retiro rechazado'}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <Badge 
              className={`gap-1 ${getStatusInfo(withdrawal.status).bgColor} ${getStatusInfo(withdrawal.status).color} ${getStatusInfo(withdrawal.status).borderColor}`}
            >
              {getStatusInfo(withdrawal.status).label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 border border-info/20">
              <Calendar className="h-4 w-4 text-info" />
            </div>
            Cronología del Retiro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon;
              const isLast = index === timelineEvents.length - 1;
              
              return (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline Icon */}
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-lg ${event.bgColor} border ${event.borderColor}`}>
                      <IconComponent className={`h-5 w-5 ${event.color}`} />
                    </div>
                    {!isLast && (
                      <div className="w-px h-12 bg-muted-foreground/30 mt-2" />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 pb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {event.title}
                        </h3>
                        {event.completed && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 border border-secondary/20">
              <User className="h-4 w-4 text-secondary" />
            </div>
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ID del Retiro
                </label>
                <p className="text-base font-mono bg-muted/30 px-3 py-2 rounded">
                  #{withdrawal.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  ¿Está archivado?
                </label>
                <p className="text-base">
                  {withdrawal.isArchived ? 'Sí' : 'No'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {withdrawal.reviewedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Revisado por
                  </label>
                  <p className="text-base">
                    {withdrawal.reviewedBy.email}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    ID: {withdrawal.reviewedBy.id}
                  </p>
                </div>
              )}
              {withdrawal.pdfUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">
                    Documento PDF
                  </label>
                  <a
                    href={withdrawal.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium underline"
                  >
                    Descargar comprobante
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}