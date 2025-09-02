'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import {
  formatSimpleId,
  formatTableAmount,
  formatTableDate,
} from '@/features/shared/utils/table.utils';
import { WithdrawalStatus } from '@/features/withdrawals/types/enums-withdrawals';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Eye, Info, User } from 'lucide-react';
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
        <span className="font-medium text-primary">
          {formatSimpleId(row.original.id)}
        </span>
      ),
    },

    {
      accessorKey: 'user',
      header: 'Usuario',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <p className=" flex space-x-1">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{user.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const { date, time } = formatTableDate(row.original.createdAt);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{date}</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const { formatted } = formatTableAmount(row.original.amount);
        return <span className="font-semibold">{formatted}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.original.status as WithdrawalStatus;
        const config = getStatusConfig(status);
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },

    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
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
