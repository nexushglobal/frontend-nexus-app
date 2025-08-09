'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { ProductAdmin } from '../../types/product.type';
import {
  createProductAdminColumns,
  defaultColumnVisibility,
} from './columns/productAdminColumns';

interface ProductAdminTableProps {
  data: ProductAdmin[];
  isLoading?: boolean;
}

export function ProductAdminTable({ data, isLoading }: ProductAdminTableProps) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );

  const columns = useMemo(
    () =>
      createProductAdminColumns({
        onViewDetail: (productId) => {
          router.push(
            `/dashboard/fac-ecommerce/productos/detalle/${productId}`,
          );
        },
      }),
    [router],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      emptyMessage="No hay productos registrados. Cuando agregues productos, aparecerán aquí."
    />
  );
}
