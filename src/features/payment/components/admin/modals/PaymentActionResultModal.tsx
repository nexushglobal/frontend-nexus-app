'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { PaymentOperationResponse } from '@/features/payment/types/approval.type';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Share2,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentActionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PaymentOperationResponse;
  action: 'approve' | 'reject' | 'complete';
}

export function PaymentActionResultModal({
  isOpen,
  onClose,
  result,
  action,
}: PaymentActionResultModalProps) {
  const router = useRouter();
  console.log('data', { result });

  const handleNavigateToPayments = () => {
    router.push('/dashboard/fac-pagos');
    onClose();
  };

  const handleShareWhatsApp = () => {
    const userName = result.data?.user?.fullName || result.data?.user?.email || 'Usuario';
    const actionText = getActionText().toLowerCase();
    const documentNumber = result.data?.user?.documentNumber || 'N/A';
    const phone = result.data?.user?.phone || 'N/A';
    
    const message = `✅ *Pago ${actionText}*\n\n` +
      `👤 *Usuario:* ${userName}\n` +
      `📄 *Documento:* ${documentNumber}\n` +
      `📞 *Teléfono:* ${phone}\n` +
      `📅 *Fecha:* ${format(new Date(), 'dd/MM/yyyy - HH:mm', { locale: es })}\n` +
      `💬 *Estado:* ${result.message}\n\n` +
      `_Procesado por Nexus Global Network_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getActionText = () => {
    switch (action) {
      case 'approve':
        return 'Aprobado';
      case 'reject':
        return 'Rechazado';
      case 'complete':
        return 'Completado';
      default:
        return 'Procesado';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'reject':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-info" />;
      default:
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            Pago {getActionText()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Result Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {getActionIcon()}
                </div>
                <div>
                  <h3 className="font-medium">
                    {result?.success
                      ? 'Operación Exitosa'
                      : 'Error en la Operación'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result?.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          {result?.success && result?.data && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Fecha de Procesamiento
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(), 'dd/MM/yyyy - HH:mm', {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-3">Datos del usuario</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1 px-2 bg-muted/30 rounded">
                          <span className="text-xs font-medium text-muted-foreground">Nombre</span>
                          <span className="text-xs font-medium">
                            {result.data.user?.fullName ||
                              result.data.user?.email ||
                              'Sistema'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 px-2 bg-muted/30 rounded">
                          <span className="text-xs font-medium text-muted-foreground">Documento</span>
                          <span className="text-xs font-medium">{result.data.user?.documentNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 px-2 bg-muted/30 rounded">
                          <span className="text-xs font-medium text-muted-foreground">Teléfono</span>
                          <span className="text-xs font-medium">{result.data.user?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action specific details */}
                  {action === 'approve' && result.data.reviewedAt && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Estado: Aprobado
                        </Badge>
                      </div>
                    </>
                  )}

                  {action === 'reject' && result.data.reason && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium">Razón de Rechazo</p>
                        <p className="text-xs text-muted-foreground">
                          {result.data.reason}
                        </p>
                      </div>
                    </>
                  )}

                  {action === 'complete' && result.data.status && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Estado: {result.data.status}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareWhatsApp}
              className="shrink-0"
              title="Compartir por WhatsApp"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button onClick={handleNavigateToPayments} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              Ver Todos los Pagos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
