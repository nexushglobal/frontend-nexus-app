'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { OrderAdminItem } from '../../types/order.type';
import { OrderPreviewModal } from './OrderPreviewModal';
import {
  createOrderAdminColumns,
  defaultColumnVisibility,
} from './columns/orderAdminColumns';

interface OrderAdminTableProps {
  data: OrderAdminItem[];
  isLoading?: boolean;
}

export function OrderAdminTable({ data, isLoading }: OrderAdminTableProps) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );
  const [previewOrder, setPreviewOrder] = useState<OrderAdminItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreview = (order: OrderAdminItem) => {
    setPreviewOrder(order);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewOrder(null);
  };

  const columns = useMemo(
    () =>
      createOrderAdminColumns({
        onViewDetail: (orderId) => {
          router.push(`/dashboard/fac-pedidos/detalle/${orderId}`);
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
        emptyMessage="No hay pedidos registrados. Cuando los clientes realicen pedidos, aparecerán aquí."
      />

      <OrderPreviewModal
        order={previewOrder}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </>
  );
}
