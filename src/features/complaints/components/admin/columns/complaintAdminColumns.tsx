'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { CheckCircle, Clock, Eye, FileText, Mail, Phone, User } from 'lucide-react';
import { Complaint, DocumentType, ComplaintType, ItemType } from '../../../types/complaint.types';

interface CreateComplaintAdminColumnsProps {
  onAttendComplaint: (complaint: Complaint) => void;
}

export function createComplaintAdminColumns({
  onAttendComplaint,
}: CreateComplaintAdminColumnsProps): ColumnDef<Complaint>[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          #{row.getValue('id')}
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: 'fullName',
      header: 'Cliente',
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{complaint.fullName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{complaint.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{complaint.phone}</span>
            </div>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: 'documentType',
      header: 'Documento',
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {complaint.documentType === DocumentType.DNI ? 'DNI' : 'C.E.'}
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {complaint.documentNumber}
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'complaintType',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue('complaintType') as ComplaintType;
        return (
          <Badge variant={type === ComplaintType.COMPLAINT ? 'secondary' : 'destructive'}>
            <FileText className="h-3 w-3 mr-1" />
            {type === ComplaintType.COMPLAINT ? 'Queja' : 'Reclamo'}
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'itemType',
      header: 'Bien',
      cell: ({ row }) => {
        const itemType = row.getValue('itemType') as ItemType;
        return (
          <Badge variant="outline">
            {itemType === ItemType.PRODUCT ? 'Producto' : 'Servicio'}
          </Badge>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'claimAmount',
      header: 'Monto',
      cell: ({ row }) => {
        const amount = row.getValue('claimAmount') as number;
        return (
          <div className="font-mono text-sm">
            S/ {amount.toFixed(2)}
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'attended',
      header: 'Estado',
      cell: ({ row }) => {
        const attended = row.getValue('attended') as boolean;
        return attended ? (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Atendido
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-warning text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="space-y-1">
            <div className="text-sm">
              {date.toLocaleDateString('es-PE')}
            </div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const complaint = row.original;
        return (
          <div className="flex items-center gap-2">
            {!complaint.attended && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAttendComplaint(complaint)}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Atender
              </Button>
            )}
          </div>
        );
      },
      size: 120,
    },
  ];
}

export const defaultColumnVisibility: VisibilityState = {
  id: true,
  fullName: true,
  documentType: true,
  complaintType: true,
  itemType: false,
  claimAmount: true,
  attended: true,
  createdAt: true,
  actions: true,
};