'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Sale } from '../types/sale.types';
import {
  createSalesColumns,
  defaultColumnVisibility,
} from './columns/SalesColumns';

interface SalesTableProps {
  data: Sale[];
  isLoading?: boolean;
}

export function SalesTable({ data, isLoading = false }: SalesTableProps) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );

  const columns = useMemo(
    () =>
      createSalesColumns({
        onViewDetail: (referenceId) =>
          router.push(`/dashboard/cli-unilevel/ventas/${referenceId}`),
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
      emptyMessage="No se encontraron ventas con los filtros aplicados."
    />
  );
}
