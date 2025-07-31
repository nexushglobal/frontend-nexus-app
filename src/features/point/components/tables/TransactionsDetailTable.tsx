'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { useMemo } from 'react';
import { Item } from '../../types/points-response';
import { transactionPaymentsColumns } from '../columns/transactionPaymentsColumns';

interface Props {
  data: Item[];
  isLoading?: boolean;
  currency?: string;
}

export function TransactionsDetailTable({ data, isLoading = false }: Props) {
  const columns = useMemo(() => transactionPaymentsColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No hay registros para mostrar. Seleccione los filtros correctamente."
    />
  );
}
