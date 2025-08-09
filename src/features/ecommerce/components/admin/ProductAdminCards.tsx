'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  CheckCircle,
  DollarSign,
  ExternalLink,
  Package,
  Tag,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ProductAdmin } from '../../types/product.type';

interface ProductAdminCardsProps {
  data: ProductAdmin[];
}

export function ProductAdminCards({ data }: ProductAdminCardsProps) {
  const router = useRouter();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return {
          label: 'Disponible',
          variant: 'default' as const,
          icon: CheckCircle,
        };
      case 'out_of_stock':
        return {
          label: 'Sin Stock',
          variant: 'destructive' as const,
          icon: XCircle,
        };
      case 'low_stock':
        return {
          label: 'Stock Bajo',
          variant: 'secondary' as const,
          icon: Package,
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          icon: Package,
        };
    }
  };

  const handleViewDetail = (productId: number) => {
    router.push(`/dashboard/fac-ecommerce/productos/detalle/${productId}`);
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No hay productos registrados. Cuando agregues productos, aparecerán
            aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {data.map((product) => {
        const statusConfig = getStatusConfig(product.status);
        const StatusIcon = statusConfig.icon;
        const isLowStock = product.stock <= 10;

        return (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header con imagen y info básica */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {product.mainImage ? (
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center border">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      SKU: {product.sku}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Tag className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-muted-foreground">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={product.isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                {/* Precios */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        Socio
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(product.memberPrice)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-muted-foreground">
                        Público
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(product.publicPrice)}
                    </p>
                  </div>
                </div>

                {/* Stock y Estado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          isLowStock
                            ? 'destructive'
                            : product.stock <= 20
                            ? 'secondary'
                            : 'default'
                        }
                        className="font-mono text-xs"
                      >
                        {product.stock}
                      </Badge>
                      {isLowStock && (
                        <span className="text-xs text-red-500">Bajo</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Estado
                    </span>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="h-4 w-4" />
                      <Badge variant={statusConfig.variant} className="text-xs">
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Botón de acción */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(product.id)}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver detalle
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
