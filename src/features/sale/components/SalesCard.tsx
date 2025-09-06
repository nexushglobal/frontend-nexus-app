'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/features/shared/utils/formatCurrency';
import {
  CreditCard,
  DollarSign,
  Eye,
  Hash,
  Package,
  Phone,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  SALE_STATUS_LABELS,
  SALE_STATUS_VARIANTS,
  SALE_TYPE_LABELS,
  SALE_TYPE_VARIANTS,
} from '../constants/sale.constants';
import type { Sale } from '../types/sale.types';

interface SaleCardProps {
  data: Sale[];
}

export function SaleCard({ data }: SaleCardProps) {
  const router = useRouter();

  const handleViewDetail = (saleId: string) => {
    router.push(`/dashboard/cli-unilevel/ventas/${saleId}`);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No se encontraron ventas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((sale) => (
        <Card
          key={sale.id}
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header con cliente y estado */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {sale.clientFullName}
                    </h3>
                    {sale.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{sale.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Hash className="h-3 w-3" />
                      <span>ID: {sale.saleIdReference}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={SALE_STATUS_VARIANTS[sale.status].variant}
                  className={`${
                    SALE_STATUS_VARIANTS[sale.status].className
                  } text-xs`}
                >
                  {SALE_STATUS_LABELS[sale.status]}
                </Badge>
              </div>

              {/* Información de la venta */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Tipo
                    </span>
                  </div>
                  <Badge
                    variant={SALE_TYPE_VARIANTS[sale.type].variant}
                    className={`${
                      SALE_TYPE_VARIANTS[sale.type].className
                    } text-xs`}
                  >
                    {SALE_TYPE_LABELS[sale.type]}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Monto
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(Number(sale.amount), sale.currency)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Cuotas
                  </span>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {sale.numberCoutes || '--'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(sale.id)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver detalle
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
