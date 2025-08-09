import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package } from 'lucide-react';
import type { OrderAdminDetailResponse } from '../../types/order.type';

interface OrderProductDetailsProps {
  order: OrderAdminDetailResponse;
}

export function OrderProductDetails({ order }: OrderProductDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Productos del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.orderDetails.map((detail, index) => (
            <div key={detail.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{detail.productName}</h4>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cantidad:</span>
                      <span className="ml-2 font-medium">
                        {detail.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Precio Unit.:
                      </span>
                      <span className="ml-2 font-medium">
                        ${detail.price.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="ml-2 font-medium">
                        ${(detail.price * detail.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {detail.productImage && (
                  <div className="ml-4">
                    <img
                      src={detail.productImage}
                      alt={detail.productName}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>
              {index < order.orderDetails.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
