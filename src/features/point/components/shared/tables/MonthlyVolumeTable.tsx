'use client';

import { MonthlyVolume } from '@/features/point/types/monthly.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { monthlyVolumeColumns } from './columns/MonthlyVolumeColumns';

interface MonthlyVolumeTableProps {
  data: MonthlyVolume[];
  isLoading?: boolean;
}

export function MonthlyVolumeTable({ data, isLoading }: MonthlyVolumeTableProps) {
  return (
    <DataTable
      columns={monthlyVolumeColumns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No se encontraron volúmenes mensuales"
      getRowClassName={(row) => {
        const volume = row.original as MonthlyVolume;
        const isPending = volume.status === 'PENDING';
        return isPending ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-400' : '';
      }}
    />
  );
}