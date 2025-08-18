'use client';

import { Card } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { VisibilityState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import type { PaymentUser } from '../../types/response-payment';
import {
  createPaymentUserColumns,
  defaultColumnVisibility,
} from './columns/paymentUserColumns';

interface PaymentUserTableProps {
  data: PaymentUser[];
  isLoading?: boolean;
}

export function PaymentUserTable({ data, isLoading }: PaymentUserTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );

  const columns = useMemo(() => createPaymentUserColumns(), []);

  return (
    <Card className="shadow-sm p-2">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        emptyMessage="No tienes pagos registrados. Cuando realices pagos, aparecerán aquí."
      />
    </Card>
  );
}
