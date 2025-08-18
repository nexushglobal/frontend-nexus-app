'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Package,
  ShoppingCart,
  Store,
} from 'lucide-react';
import Link from 'next/link';
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

  const backUrl = useMemo(() => '/dashboard/cli-tienda/pedidos', []);

  if (isLoading) {
    return (
      <div className="container space-y-6">
        <OrderDetailHeader isLoading={true} />
        <LoadingState />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container space-y-6">
        <OrderDetailHeader isError={true} backUrl={backUrl} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Ha ocurrido un error al cargar el pedido.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <OrderDetailHeader
        orderId={order.id}
        status={order.status}
        backUrl={backUrl}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <OrderGeneralInfo order={order} />

          <OrderProductDetails order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderHistory order={order} />
        </div>
      </div>
    </div>
  );
}

// Enhanced Header Component
interface OrderDetailHeaderProps {
  orderId?: number;
  status?: string;
  backUrl?: string;
  isLoading?: boolean;
  isError?: boolean;
}

function OrderDetailHeader({
  orderId,
  status,
  backUrl = '/dashboard/cli-tienda/pedidos',
  isLoading = false,
  isError = false,
}: OrderDetailHeaderProps) {
  const title = isError
    ? 'Error'
    : isLoading
    ? 'Cargando...'
    : `Pedido #${orderId}`;

  const subtitle = isError
    ? 'No se pudo cargar el detalle del pedido'
    : isLoading
    ? 'Obteniendo información del pedido...'
    : 'Detalle del pedido';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href={backUrl}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {status && !isLoading && !isError && (
          <Badge variant="outline" className={getStatusBadgeVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/cli-tienda/pedidos">
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Mis pedidos
          </Button>
        </Link>

        <Link href="/dashboard/cli-tienda/productos">
          <Button variant="outline" className="gap-2">
            <Store className="h-4 w-4" />
            Seguir comprando
          </Button>
        </Link>

        <Link href="/dashboard/cli-tienda/carrito">
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Mi Carrito
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Cargando información general...
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">
                Cargando productos del pedido...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
