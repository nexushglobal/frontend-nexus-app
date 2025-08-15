'use client';

import { PointTransactionBase } from '@/features/point/types/points.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { pointTransactionColumns } from './columns/PointTransactionsColumns';

interface PointTransactionsTableProps {
  data: PointTransactionBase[];
  isLoading?: boolean;
}

export function PointTransactionsTable({
  data,
  isLoading,
}: PointTransactionsTableProps) {
  return (
    <DataTable
      columns={pointTransactionColumns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No se encontraron transacciones"
    />
  );
}
