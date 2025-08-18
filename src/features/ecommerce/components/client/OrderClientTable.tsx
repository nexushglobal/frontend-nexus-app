'use client';

import { Card } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { OrderClientItem } from '../../types/order.type';
import { OrderPreviewModal } from '../admin/OrderPreviewModal';
import {
  createOrderClientColumns,
  defaultClientColumnVisibility,
} from './columns/orderClientColumns';

interface OrderClientTableProps {
  data: OrderClientItem[];
  isLoading?: boolean;
}

export function OrderClientTable({ data, isLoading }: OrderClientTableProps) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultClientColumnVisibility,
  );
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

  const columns = useMemo(
    () =>
      createOrderClientColumns({
        onViewDetail: (orderId) => {
          router.push(`/dashboard/cli-tienda/pedidos/detalle/${orderId}`);
        },
        onPreview: handlePreview,
      }),
    [router],
  );

  return (
    <>
      <Card className="shadow-sm p-2">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          emptyMessage="No tienes pedidos aún. Cuando realices compras, aparecerán aquí."
          getRowClassName={(row) => {
            const order = row.original as OrderClientItem;
            const isPending = order.status === 'PENDING';
            const isRejected = order.status === 'REJECTED';
            const isDelivered = order.status === 'DELIVERED';

            if (isPending) {
              return 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-400 hover:bg-yellow-50/70';
            }
            if (isRejected) {
              return 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-l-red-400 hover:bg-red-50/70';
            }
            if (isDelivered) {
              return 'bg-green-50/50 dark:bg-green-900/10 border-l-4 border-l-green-400 hover:bg-green-50/70';
            }
            return 'hover:bg-muted/50';
          }}
        />
      </Card>

      <OrderPreviewModal
        order={previewOrder as any}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onViewDetail={(orderId) =>
          router.push(`/dashboard/cli-tiendapedidos/detalle/${orderId}`)
        }
      />
    </>
  );
}
