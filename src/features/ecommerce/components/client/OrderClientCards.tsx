'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { CalendarDays, Eye, Package2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { OrderClientItem } from '../../types/order.type';
import { OrderPreviewModal } from '../admin/OrderPreviewModal';

interface OrderClientCardsProps {
  data: OrderClientItem[];
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

export function OrderClientCards({ data }: OrderClientCardsProps) {
  const router = useRouter();
  const [previewOrder, setPreviewOrder] = useState<OrderClientItem | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (order: OrderClientItem) => {
    setPreviewOrder(order);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewOrder(null);
  };

  const handleViewDetail = (orderId: number) => {
    router.push(`/dashboard/cli-tienda/pedidos/detalle/${orderId}`);
  };

  if (data.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tienes pedidos</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Cuando realices compras, tus pedidos aparecerán aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {data.map((order) => (
          <Card
            key={order.id}
            className="shadow-sm border-l-4 border-l-primary/20 hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-primary" />
                  Pedido #{order.id}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={getStatusBadgeVariant(order.status)}
                >
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {order.totalItems}
                    </p>
                    <p className="text-xs text-muted-foreground">Items</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">
                      {formatCurrency(order.totalAmount, 'PEN')}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CalendarDays className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-medium">
                      {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(order)}
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Vista rápida
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleViewDetail(order.id)}
                    className="flex-1 gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderPreviewModal
        order={previewOrder as any}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onViewDetail={(orderId) =>
          router.push(`/dashboard/cli-tienda/pedidos/detalle/${orderId}`)
        }
      />
    </>
  );
}
