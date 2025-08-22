'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Lead } from '../../types/leads.types';
import { createLeadsColumns, defaultColumnVisibility } from './columns/LeadsColumns';

interface LeadsTableProps {
  data: Lead[];
  isLoading?: boolean;
}

export function LeadsTable({ data, isLoading }: LeadsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility);

  const columns = useMemo(() => createLeadsColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      emptyMessage="No se encontraron leads"
    />
  );
}
