'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Eye, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { OrderAdminItem } from '../../types/order.type';

interface OrderPreviewModalProps {
  order: OrderAdminItem | null;
  isOpen: boolean;
  onClose: () => void;
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

export function OrderPreviewModal({
  order,
  isOpen,
  onClose,
}: OrderPreviewModalProps) {
  const router = useRouter();

  if (!order) return null;

  const handleViewDetail = () => {
    router.push(`/dashboard/fac-pedidos/detalle/${order.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Pedido #{order.id}
          </DialogTitle>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Resumen de la orden */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{order.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeVariant(order.status)}
                  >
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de items
                  </p>
                  <p className="font-medium">{order.totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monto total</p>
                  <p className="font-medium text-lg">
                    ${order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de creación
                  </p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.metadata.Productos.map((producto, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{producto.Nombre}</h4>
                        <p className="text-sm text-muted-foreground">
                          SKU: {producto.SKU}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {producto.Cantidad} x $
                          {producto.Precio.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total: $
                          {(
                            producto.Cantidad * producto.Precio
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {index < order.metadata.Productos.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones fijos en la parte inferior */}
        <div className="flex-shrink-0 border-t pt-4 mt-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={handleViewDetail} className="gap-2">
              <Eye className="h-4 w-4" />
              Ver Detalle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
