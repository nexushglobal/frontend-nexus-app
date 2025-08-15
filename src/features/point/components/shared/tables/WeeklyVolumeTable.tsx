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
    />
  );
}
