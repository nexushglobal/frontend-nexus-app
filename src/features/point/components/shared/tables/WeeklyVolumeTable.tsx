'use client';

import { WeeklyVolume } from '@/features/point/types/weekly.types';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { weeklyVolumeColumns } from './columns/WeeklyVolumeColumns';

interface WeeklyVolumeTableProps {
  data: WeeklyVolume[];
  isLoading?: boolean;
}

export function WeeklyVolumeTable({ data, isLoading }: WeeklyVolumeTableProps) {
  return (
    <DataTable
      columns={weeklyVolumeColumns}
      data={data}
      isLoading={isLoading}
      emptyMessage="No se encontraron volúmenes semanales"
      getRowClassName={(row) => {
        const volume = row.original as WeeklyVolume;
        const isPending = volume.status === 'PENDING';
        return isPending ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-400' : '';
      }}
    />
  );
}
