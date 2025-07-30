'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { useMemo } from 'react';
import { Transaction } from '../../types/points.types';
import { summaryPointsColumns } from '../columns/summaryPointsColumns';

interface Props {
  data: Transaction[];
  isLoading?: boolean;
  currency?: string;
}

export function TransactionsTable({ data, isLoading = false }: Props) {
  const columns = useMemo(() => summaryPointsColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No hay registros para mostrar. Seleccione los filtros correctamente."
    />
  );
}
