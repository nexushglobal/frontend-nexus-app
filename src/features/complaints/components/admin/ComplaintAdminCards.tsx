'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Package,
  Phone,
  User,
} from 'lucide-react';
import { Complaint, DocumentType, ComplaintType, ItemType } from '../../types/complaint.types';

interface ComplaintAdminCardsProps {
  data: Complaint[];
  onAttendComplaint: (complaint: Complaint) => void;
}

export function ComplaintAdminCards({ data, onAttendComplaint }: ComplaintAdminCardsProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No hay quejas o reclamos registrados
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Aún no se han registrado quejas o reclamos con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((complaint) => {
        const formatDate = (date: Date) => {
          const d = new Date(date);
          return {
            date: d.toLocaleDateString('es-PE'),
            time: d.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        };

        const formatted = formatDate(complaint.createdAt);

        return (
          <Card key={complaint.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header con cliente y estado */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {complaint.fullName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{complaint.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {complaint.documentType === DocumentType.DNI ? 'DNI' : 'C.E.'}: {complaint.documentNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{complaint.phone}</span>
                      </div>
                    </div>
                  </div>
                  {complaint.attended ? (
                    <Badge variant="default" className="bg-success text-success-foreground whitespace-nowrap ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Atendido
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-warning text-warning-foreground whitespace-nowrap ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendiente
                    </Badge>
                  )}
                </div>

                {/* Información del reclamo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={complaint.complaintType === ComplaintType.COMPLAINT ? 'secondary' : 'destructive'}>
                        <FileText className="h-3 w-3 mr-1" />
                        {complaint.complaintType === ComplaintType.COMPLAINT ? 'Queja' : 'Reclamo'}
                      </Badge>
                      <Badge variant="outline">
                        {complaint.itemType === ItemType.PRODUCT ? 'Producto' : 'Servicio'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        S/ {complaint.claimAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Descripción y detalle */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Descripción:
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Detalle:
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                          {complaint.detail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          ID: #{complaint.id}
                        </span>
                      </div>
                      {complaint.order && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Pedido: {complaint.order}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Fecha
                        </span>
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        <div>{formatted.date}</div>
                        <div className="text-gray-500">{formatted.time}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de acción */}
                {!complaint.attended && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAttendComplaint(complaint)}
                    className="w-full flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como Atendido
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}