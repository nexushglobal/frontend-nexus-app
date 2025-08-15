'use client';

import { PointLotTransactionBase } from '@/features/point/types/points.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { pointLotTransactionColumns } from './columns/PointLotTransactionsColumns';

interface PointLotTransactionsTableProps {
  data: PointLotTransactionBase[];
  isLoading?: boolean;
}

export function PointLotTransactionsTable({
  data,
  isLoading,
}: PointLotTransactionsTableProps) {
  return (
    <DataTable
      columns={pointLotTransactionColumns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No se encontraron transacciones de lote"
    />
  );
}
