'use client';

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
          // Future: /dashboard/(facturacion)/cli-pedidos/detalle/${orderId}
          router.push(`/dashboard/cli-pedidos/detalle/${orderId}`);
        },
        onPreview: handlePreview,
      }),
    [router],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        emptyMessage="No tienes pedidos aún. Cuando realices compras, aparecerán aquí."
      />

      <OrderPreviewModal
        order={previewOrder as any}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onViewDetail={(orderId) =>
          router.push(`/dashboard/cli-pedidos/detalle/${orderId}`)
        }
      />
    </>
  );
}
