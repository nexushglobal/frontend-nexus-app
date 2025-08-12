'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useClientOrderDetails } from '../../hooks/useOrderQuery';
import { getStatusBadgeVariant, getStatusLabel } from '../../utils/orderUtils';
import { OrderGeneralInfo } from '../admin/OrderGeneralInfo';
import { OrderHistory } from '../admin/OrderHistory';
import { OrderProductDetails } from '../admin/OrderProductDetails';

export default function OrderClientDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const {
    data: order,
    isLoading,
    error,
    isError,
  } = useClientOrderDetails(orderId);

  const backUrl = useMemo(() => '/dashboard/cli-pedidos', []);

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
          backUrl={backUrl}
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
      <PageHeader
        title={`Pedido #${order.id}`}
        subtitle="Detalle del pedido"
        backUrl={backUrl}
        variant="gradient"
        actions={
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={getStatusBadgeVariant(order.status)}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderGeneralInfo order={order} />
          <OrderProductDetails order={order} />
        </div>
        <div className="space-y-6">
          {/* No mostrar info de usuario en CLI */}
          <OrderHistory order={order} />
        </div>
      </div>
    </div>
  );
}
