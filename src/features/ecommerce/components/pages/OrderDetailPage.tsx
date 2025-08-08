'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertCircle, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAdminOrderDetails } from '../../hooks/useOrderQuery';
import { getStatusBadgeVariant, getStatusLabel } from '../../utils/orderUtils';
import { OrderClientInfo } from '../admin/OrderClientInfo';
import { OrderGeneralInfo } from '../admin/OrderGeneralInfo';
import { OrderHistory } from '../admin/OrderHistory';
import { OrderProductDetails } from '../admin/OrderProductDetails';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const {
    data: order,
    isLoading,
    error,
    isError,
  } = useAdminOrderDetails(orderId);

  const canSendOrder = useMemo(() => {
    return order?.status === 'APPROVED';
  }, [order?.status]);

  const handleSendOrder = () => {
    // TODO: Implementar envío de pedido
    console.log('Enviar pedido:', orderId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader
          title="Error"
          subtitle="No se pudo cargar el detalle del pedido"
          backUrl="/dashboard/fac-pedidos"
          variant="gradient"
        />
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Ha ocurrido un error al cargar el pedido.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <PageHeader
        title={`Pedido #${order.id}`}
        subtitle="Detalle completo del pedido"
        backUrl="/dashboard/fac-pedidos"
        variant="gradient"
        actions={
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={getStatusBadgeVariant(order.status)}
            >
              {getStatusLabel(order.status)}
            </Badge>
            {canSendOrder && (
              <Button
                onClick={handleSendOrder}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Pedido
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Pedido */}
        <div className="lg:col-span-2 space-y-6">
          <OrderGeneralInfo order={order} />
          <OrderProductDetails order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderClientInfo order={order} />
          <OrderHistory order={order} />
        </div>
      </div>
    </div>
  );
}
