'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  Eye
} from 'lucide-react';
import { Complaint, ComplaintType, DocumentType, ItemType } from '../types/complaints.types';
import { useUpdateComplaintAttended } from '../hooks/useComplaints';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import { useState } from 'react';

interface ComplaintsCardsProps {
  data: Complaint[];
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

export function ComplaintsCards({ data }: ComplaintsCardsProps) {
  const updateAttended = useUpdateComplaintAttended();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAttended = (complaint: Complaint) => {
    updateAttended.mutate({
      id: complaint.id,
      data: { attended: !complaint.attended },
    });
  };

  const handleViewDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  if (!data.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No se encontraron reclamos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((complaint) => (
        <Card 
          key={complaint.id} 
          className={`${complaint.attended ? 'bg-success/5 border-success/20' : 'border-border'}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    #{complaint.id}
                  </span>
                  <Badge variant={getComplaintTypeBadgeVariant(complaint.complaintType)}>
                    {getComplaintTypeLabel(complaint.complaintType)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(complaint.createdAt)}
                </p>
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
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Cliente */}
            <div className="info-field">
              <User className="field-icon" />
              <div className="flex-1">
                <p className="text-sm font-medium">{complaint.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {getDocumentTypeLabel(complaint.documentType)}: {complaint.documentNumber}
                </p>
              </div>
            </div>

            {/* Contacto */}
            <div className="grid grid-cols-1 gap-3">
              <div className="info-field">
                <Mail className="field-icon" />
                <div className="flex-1">
                  <p className="text-sm">{complaint.email}</p>
                </div>
              </div>
              
              <div className="info-field">
                <Phone className="field-icon" />
                <div className="flex-1">
                  <p className="text-sm">{complaint.phone}</p>
                </div>
              </div>
            </div>

            {/* Dirección */}
            {complaint.address && (
              <div className="info-field">
                <MapPin className="field-icon" />
                <div className="flex-1">
                  <p className="text-sm">{complaint.address}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Detalles del reclamo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {complaint.itemType === 'PRODUCT' ? (
                    <Package className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {getItemTypeLabel(complaint.itemType)}
                  </span>
                </div>
                
                {complaint.claimAmount && (
                  <span className="text-sm font-mono">
                    S/ {complaint.claimAmount}
                  </span>
                )}
              </div>

              {complaint.order && (
                <div className="info-field">
                  <FileText className="field-icon" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Pedido</p>
                    <p className="text-sm font-mono">{complaint.order}</p>
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="info-field-start">
                <AlertCircle className="field-icon mt-1" />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Descripción</p>
                    <p className="text-sm">{complaint.description}</p>
                  </div>
                  
                  {complaint.detail && (
                    <div>
                      <p className="text-xs text-muted-foreground">Detalle</p>
                      <p className="text-sm">{complaint.detail}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Acciones */}
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDetail(complaint)}
                className="min-w-[100px]"
              >
                <Eye className="mr-2 h-3 w-3" />
                Ver detalle
              </Button>
              
              <Button
                size="sm"
                variant={complaint.attended ? 'outline' : 'default'}
                onClick={() => handleToggleAttended(complaint)}
                disabled={updateAttended.isPending}
                className="min-w-[120px]"
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
          </CardContent>
        </Card>
      ))}
      
      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}