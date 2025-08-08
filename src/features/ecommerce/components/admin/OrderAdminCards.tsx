'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, ShoppingCart, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { OrderAdminItem } from '../../types/order.type';
import { OrderPreviewModal } from './OrderPreviewModal';

interface OrderAdminCardsProps {
  data: OrderAdminItem[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'SENT':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DELIVERED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CANCELED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pendiente';
    case 'APPROVED':
      return 'Aprobado';
    case 'SENT':
      return 'Enviado';
    case 'DELIVERED':
      return 'Entregado';
    case 'REJECTED':
      return 'Rechazado';
    case 'CANCELED':
      return 'Cancelado';
    default:
      return status;
  }
};

export function OrderAdminCards({ data }: OrderAdminCardsProps) {
  const router = useRouter();
  const [previewOrder, setPreviewOrder] = useState<OrderAdminItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (order: OrderAdminItem) => {
    setPreviewOrder(order);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewOrder(null);
  };

  const handleViewDetail = (orderId: number) => {
    router.push(`/dashboard/fac-pedidos/detalle/${orderId}`);
  };

  if (data.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No hay pedidos
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No hay pedidos registrados. Cuando los clientes realicen pedidos,
            aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {data.map((order) => (
          <Card key={order.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">Pedido #{order.id}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{order.userName}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeVariant(order.status)}
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>

                {/* Información principal */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium truncate">{order.userEmail}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <p className="font-medium">{order.totalItems}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total:</span>
                    <p className="font-medium text-lg">
                      ${order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha:</span>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(order)}
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Vista previa
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleViewDetail(order.id)}
                    className="flex-1 gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderPreviewModal
        order={previewOrder}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </>
  );
}
