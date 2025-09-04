'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/features/shared/utils/table.utils';
import { 
  CheckCircle, 
  Clock, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CreditCard,
  Package,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Complaint, ComplaintType, DocumentType, ItemType } from '../types/complaints.types';
import { useUpdateComplaintAttended } from '../hooks/useComplaints';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getComplaintTypeLabel = (type: ComplaintType): string => {
  return type === 'COMPLAINT' ? 'Queja' : 'Reclamo';
};

const getComplaintTypeBadgeVariant = (type: ComplaintType): 'default' | 'secondary' => {
  return type === 'COMPLAINT' ? 'secondary' : 'default';
};

const getItemTypeLabel = (type: ItemType): string => {
  return type === 'PRODUCT' ? 'Producto' : 'Servicio';
};

const getDocumentTypeLabel = (type: DocumentType): string => {
  return type === 'DNI' ? 'DNI' : 'Carnet de Extranjería';
};

export function ComplaintDetailModal({
  complaint,
  open,
  onOpenChange,
}: ComplaintDetailModalProps) {
  const updateAttended = useUpdateComplaintAttended();

  if (!complaint) {
    return null;
  }

  const handleToggleAttended = () => {
    updateAttended.mutate({
      id: complaint.id,
      data: { attended: !complaint.attended },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Detalle del Reclamo #{complaint.id}</span>
            <Badge variant={getComplaintTypeBadgeVariant(complaint.complaintType)}>
              {getComplaintTypeLabel(complaint.complaintType)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa del reclamo registrado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y Fecha */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDateTime(complaint.createdAt)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {complaint.attended ? (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Atendido
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  Pendiente
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información del Cliente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="info-field">
                <User className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Nombre completo</p>
                  <p className="text-sm text-muted-foreground">{complaint.fullName}</p>
                </div>
              </div>

              <div className="info-field">
                <FileText className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Documento</p>
                  <p className="text-sm text-muted-foreground">
                    {getDocumentTypeLabel(complaint.documentType)}: {complaint.documentNumber}
                  </p>
                </div>
              </div>

              <div className="info-field">
                <Mail className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{complaint.email}</p>
                </div>
              </div>

              <div className="info-field">
                <Phone className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{complaint.phone}</p>
                </div>
              </div>
            </div>

            {complaint.address && (
              <div className="info-field">
                <MapPin className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dirección</p>
                  <p className="text-sm text-muted-foreground">{complaint.address}</p>
                </div>
              </div>
            )}

            {complaint.parentGuardian && (
              <div className="info-field">
                <User className="field-icon" />
                <div>
                  <p className="text-sm font-medium text-foreground">Padre/Tutor</p>
                  <p className="text-sm text-muted-foreground">{complaint.parentGuardian}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Información del Reclamo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información del Reclamo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="info-field">
                {complaint.itemType === 'PRODUCT' ? (
                  <Package className="field-icon" />
                ) : (
                  <CreditCard className="field-icon" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Tipo de ítem</p>
                  <p className="text-sm text-muted-foreground">
                    {getItemTypeLabel(complaint.itemType)}
                  </p>
                </div>
              </div>

              {complaint.claimAmount && (
                <div className="info-field">
                  <DollarSign className="field-icon" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Monto reclamado</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      S/ {complaint.claimAmount}
                    </p>
                  </div>
                </div>
              )}

              {complaint.order && (
                <div className="info-field">
                  <FileText className="field-icon" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Número de pedido</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {complaint.order}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="info-field-start">
              <AlertCircle className="field-icon mt-1" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Descripción</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>
                
                {complaint.detail && (
                  <div>
                    <p className="text-sm font-medium text-foreground">Detalle adicional</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {complaint.detail}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
            
            <Button
              variant={complaint.attended ? 'outline' : 'default'}
              onClick={handleToggleAttended}
              disabled={updateAttended.isPending}
              className="min-w-[140px]"
            >
              {updateAttended.isPending ? (
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border border-current border-r-transparent" />
              ) : complaint.attended ? (
                <Clock className="mr-2 h-3 w-3" />
              ) : (
                <CheckCircle className="mr-2 h-3 w-3" />
              )}
              {complaint.attended ? 'Marcar pendiente' : 'Marcar atendido'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}