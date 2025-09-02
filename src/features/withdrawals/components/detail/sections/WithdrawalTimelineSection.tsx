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
  );
}