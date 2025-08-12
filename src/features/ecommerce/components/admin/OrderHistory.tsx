import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import type {
  OrderAdminDetailResponse,
  OrderClientDetailResponse,
} from '../../types/order.type';
import { getActionLabel } from '../../utils/orderUtils';

interface OrderHistoryProps {
  order: OrderAdminDetailResponse | OrderClientDetailResponse;
}

export function OrderHistory({ order }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.orderHistory.map((history, index) => (
            <div key={history.id} className="relative">
              {index !== order.orderHistory.length - 1 && (
                <div className="absolute left-2 top-8 bottom-0 w-px bg-border" />
              )}
              <div className="flex gap-3">
                <div className="w-4 h-4 rounded-full bg-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {getActionLabel(history.action)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(history.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  {history.notes && (
                    <p className="text-xs text-muted-foreground">
                      {history.notes}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Por: {history.userName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
