'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { PointLotTransactionBase } from '../types/points.types';
import { pointLotTransactionColumns } from './PointLotTransactionsColumns';

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
