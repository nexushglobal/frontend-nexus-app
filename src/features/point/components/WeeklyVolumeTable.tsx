'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { WeeklyVolume } from '../types/weekly.types';
import { weeklyVolumeColumns } from './WeeklyVolumeColumns';

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
