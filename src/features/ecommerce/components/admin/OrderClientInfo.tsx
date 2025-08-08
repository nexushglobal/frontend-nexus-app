import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import type { OrderAdminDetailResponse } from '../../types/order.type';

interface OrderClientInfoProps {
  order: OrderAdminDetailResponse;
}

export function OrderClientInfo({ order }: OrderClientInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Nombre</p>
          <p className="font-medium">{order.userName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-sm">{order.userEmail}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            ID Usuario
          </p>
          <p className="text-sm font-mono">{order.userId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
