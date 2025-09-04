'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle, Clock, Mail, MapPin, Phone, User, FileText, Eye, Package, CreditCard, DollarSign } from 'lucide-react';
import { Complaint, ComplaintType, DocumentType, ItemType } from '../types/complaints.types';
import { useUpdateComplaintAttended } from '../hooks/useComplaints';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import { useState } from 'react';

interface ComplaintsTableProps {
  data: Complaint[];
  isLoading?: boolean;
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

export function ComplaintsTable({ data, isLoading = false }: ComplaintsTableProps) {
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

  const columns: ColumnDef<Complaint>[] = [
    {
      accessorKey: 'fullName',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{row.original.fullName}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {getDocumentTypeLabel(row.original.documentType)}: {row.original.documentNumber}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'contactInfo',
      header: 'Información de Contacto',
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[180px]" title={row.original.email}>
                {row.original.email}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-500" />
            <span className="text-sm">{row.original.phone}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'complaintInfo',
      header: 'Información del Reclamo',
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={getComplaintTypeBadgeVariant(row.original.complaintType)}>
              {getComplaintTypeLabel(row.original.complaintType)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {row.original.itemType === 'PRODUCT' ? (
              <Package className="h-4 w-4 text-orange-500" />
            ) : (
              <CreditCard className="h-4 w-4 text-purple-500" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {getItemTypeLabel(row.original.itemType)}
              </span>
              {row.original.claimAmount && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-mono">S/ {row.original.claimAmount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetail(row.original)}
            className="h-8 px-3"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalle</span>
          </Button>
          
          <Button
            size="sm"
            variant={row.original.attended ? 'outline' : 'default'}
            onClick={() => handleToggleAttended(row.original)}
            disabled={updateAttended.isPending}
            className="h-8 px-3"
          >
            {updateAttended.isPending ? (
              <div className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent" />
            ) : row.original.attended ? (
              <Clock className="h-3 w-3" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )}
            <span className="sr-only">
              {row.original.attended ? 'Marcar pendiente' : 'Marcar atendido'}
            </span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage="No se encontraron reclamos"
        getRowClassName={(row) => 
          row.original.attended ? 'bg-success/5' : ''
        }
      />
      
      <ComplaintDetailModal
        complaint={selectedComplaint}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}