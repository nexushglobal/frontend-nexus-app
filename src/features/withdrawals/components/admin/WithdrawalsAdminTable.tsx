'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataTable } from '@/features/shared/components/table/DataTable';
import {
  formatCurrency,
  formatDate,
} from '@/features/shared/utils/formatCurrency';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Info } from 'lucide-react';
import Link from 'next/link';
import { WithdrawalAdmin } from '../../types/withdrawals.types';

interface WithdrawalsAdminTableProps {
  data: WithdrawalAdmin[];
  isLoading?: boolean;
  onOpenSummary: (withdrawal: WithdrawalAdmin) => void;
}

export function WithdrawalsAdminTable({
  data,
  isLoading,
  onOpenSummary,
}: WithdrawalsAdminTableProps) {
  const columns: ColumnDef<WithdrawalAdmin>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-medium">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatCurrency(row.original.amount, 'PEN')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'user',
      header: 'Usuario',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.user.email}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenSummary(row.original)}
          >
            <Info className="h-4 w-4 mr-1" /> Resumen
          </Button>
          <Link href={`/dashboard/fac-retiros/detalle/${row.original.id}`}>
            <Button variant="default" size="sm">
              <Eye className="h-4 w-4 mr-1" /> Detalle
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
