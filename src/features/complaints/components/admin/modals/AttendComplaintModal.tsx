'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, Clock, Loader2, Mail, Phone, User, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { complaintService } from '../../../services/complaint.service';
import { Complaint, DocumentType, ComplaintType, ItemType } from '../../../types/complaint.types';

interface AttendComplaintModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AttendComplaintModal({
  complaint,
  isOpen,
  onClose,
}: AttendComplaintModalProps) {
  const queryClient = useQueryClient();

  const attendMutation = useMutation({
    mutationFn: async (complaintId: number) => {
      return complaintService.attendComplaint(complaintId, { attended: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Queja/Reclamo marcado como atendido exitosamente');
      onClose();
    },
    onError: (error: any) => {
      toast.error('Error al marcar como atendido', {
        description: error?.message || 'Inténtelo nuevamente',
      });
    },
  });

  if (!complaint) return null;

  const handleConfirm = () => {
    attendMutation.mutate(complaint.id);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: d.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const formatted = formatDate(complaint.createdAt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirmar Atención
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea marcar esta queja/reclamo como atendida?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado actual */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Estado actual:</span>
            </div>
            <Badge variant="secondary" className="bg-warning text-warning-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Pendiente
            </Badge>
          </div>

          <Separator />

          {/* Información del cliente */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Información del Cliente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{complaint.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {complaint.documentType === DocumentType.DNI ? 'DNI' : 'C.E.'}: {complaint.documentNumber}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">{complaint.email}</div>
                  <div className="text-xs text-muted-foreground">Correo electrónico</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{complaint.phone}</div>
                  <div className="text-xs text-muted-foreground">Teléfono</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">#{complaint.id}</div>
                  <div className="text-xs text-muted-foreground">ID de solicitud</div>
                </div>
              </div>
            </div>
            {complaint.address && (
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground mb-1">Domicilio:</div>
                <div className="text-sm">{complaint.address}</div>
              </div>
            )}
          </div>

          <Separator />

          {/* Detalles del reclamo */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalles de la Solicitud
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Tipo:</div>
                <Badge variant={complaint.complaintType === ComplaintType.COMPLAINT ? 'secondary' : 'destructive'}>
                  {complaint.complaintType === ComplaintType.COMPLAINT ? 'Queja' : 'Reclamo'}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Bien:</div>
                <Badge variant="outline">
                  {complaint.itemType === ItemType.PRODUCT ? 'Producto' : 'Servicio'}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Monto:</div>
                <div className="font-mono font-medium text-green-600">S/ {complaint.claimAmount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Fecha:</div>
                <div className="text-sm">{formatted.date}</div>
                <div className="text-xs text-muted-foreground">{formatted.time}</div>
              </div>
            </div>

            {complaint.order && (
              <div className="mt-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">Número de Pedido:</div>
                <div className="font-mono text-sm">{complaint.order}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Descripción:</div>
                <div className="p-3 bg-muted/30 rounded-lg text-sm">
                  {complaint.description}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Detalle:</div>
                <div className="p-3 bg-muted/30 rounded-lg text-sm">
                  {complaint.detail}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={attendMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={attendMutation.isPending}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            {attendMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Marcando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar Atención
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}