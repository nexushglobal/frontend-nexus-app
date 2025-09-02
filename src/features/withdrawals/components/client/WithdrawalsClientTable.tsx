'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { getStatusConfig } from '@/features/shared/utils/status.utils';
import { formatTableAmount, formatTableDate, formatWithdrawalId } from '@/features/shared/utils/table.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  Banknote,
  Building2,
  Calendar,
  DollarSign,
  Eye,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { WithdrawalClient } from '../../types/withdrawals.types';

interface WithdrawalsClientTableProps {
  data: WithdrawalClient[];
  isLoading?: boolean;
  onOpenSummary: (withdrawal: WithdrawalClient) => void;
}

export function WithdrawalsClientTable({
  data,
  isLoading,
  onOpenSummary,
}: WithdrawalsClientTableProps) {
  const columns: ColumnDef<WithdrawalClient>[] = [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary" />
          <span>Retiro</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-primary">{formatWithdrawalId(row.original.id)}</div>
      ),
      size: 100,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const statusConfig = getStatusConfig(row.original.status);
        return (
          <Badge
            variant={statusConfig.variant}
            className={statusConfig.className}
          >
            {statusConfig.label}
          </Badge>
        );
      },
      size: 130,
    },
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => {
        const { formatted } = formatTableAmount(row.original.amount);
        return (
          <span className="font-bold text-lg">
            {formatted}
          </span>
        );
      },
      size: 130,
    },
    {
      accessorKey: 'bankName',
      header: () => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span>Banco</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.bankName}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.accountNumber}
          </div>
        </div>
      ),
      size: 160,
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Fecha</span>
        </div>
      ),
      cell: ({ row }) => {
        const { date, time } = formatTableDate(row.original.createdAt);
        return (
          <div className="space-y-1">
            <div className="font-medium">{date}</div>
            <div className="text-xs text-muted-foreground">{time}</div>
          </div>
        );
      },
      size: 140,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenSummary(row.original)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title="Vista rápida"
          >
            <Info className="h-4 w-4" />
          </Button>
          <Link
            href={`/dashboard/cli-transacciones/mis-retiros/detalle/${row.original.id}`}
          >
            <Button
              variant="default"
              size="sm"
              className="h-8 px-3 text-xs"
              title="Ver detalle completo"
            >
              <Eye className="h-3 w-3 mr-1" />
              Detalle
            </Button>
          </Link>
        </div>
      ),
      size: 120,
    },
  ];

  return (
    <Card className="shadow-sm p-2">
      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyMessage="No tienes retiros registrados. Cuando solicites retiros, aparecerán aquí."
        />
      </CardContent>
    </Card>
  );
}
