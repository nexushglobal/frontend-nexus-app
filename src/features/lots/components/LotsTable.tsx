'use client';

import { DataTable } from '@/features/shared/components/table/DataTable';
import type { LotDetail } from '../types/lots.types';
import { lotsColumns } from './columns/lotsColumns';
import { LotsCards } from './LotsCards';

interface LotsTableProps {
  data: LotDetail[];
  isLoading?: boolean;
}

export function LotsTable({ data, isLoading }: LotsTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable
          columns={lotsColumns}
          data={data}
          isLoading={isLoading}
          emptyMessage="No se encontraron lotes que coincidan con los filtros aplicados."
          showColumnToggle={true}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <LotsCards data={data} />
      </div>
    </>
  );
}
