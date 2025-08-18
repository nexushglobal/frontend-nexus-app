import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import { Calendar, Clock, ShoppingBag } from 'lucide-react';
import type {
  OrderAdminDetailResponse,
  OrderClientDetailResponse,
} from '../../types/order.type';

interface OrderGeneralInfoProps {
  order: OrderAdminDetailResponse | OrderClientDetailResponse;
}

export function OrderGeneralInfo({ order }: OrderGeneralInfoProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Información General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Total de Items
            </p>
            <p className="text-lg font-semibold">{order.totalItems}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">
              {formatCurrency(order.totalAmount, 'PEN')}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Fecha de Creación
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Última Actualización
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {new Date(order.updatedAt).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
