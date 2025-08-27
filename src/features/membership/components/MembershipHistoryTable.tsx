'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/features/shared/components/table/DataTable';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { VisibilityState } from '@tanstack/react-table';
import { AlertCircle, History } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MembershipHistoryItem } from '../types/membership.types';
import { MembershipHistoryCards } from './MembershipHistoryCards';
import {
  createMembershipHistoryColumns,
  defaultColumnVisibility,
} from './columns/membershipHistoryColumns';

export function MembershipHistoryTable({
  items,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  errorMessage,
  onOpenChanges,
  onOpenMetadata,
}: {
  items: MembershipHistoryItem[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  errorMessage?: string | null;
  onOpenChanges: (
    changes: Record<string, any>,
    metadata?: Record<string, any>,
  ) => void;
  onOpenMetadata: (data: Record<string, any>) => void;
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility,
  );

  const columns = useMemo(
    () =>
      createMembershipHistoryColumns({
        onOpenChanges,
      }),
    [onOpenChanges],
  );

  return (
    <div className="space-y-6 ">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden md:block">
            <DataTable<MembershipHistoryItem, unknown>
              columns={columns}
              data={items || []}
              isLoading={isLoading}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              emptyMessage="Sin movimientos registrados en tu membresía"
            />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            <MembershipHistoryCards
              items={items || []}
              onOpenChanges={onOpenChanges}
              onOpenMetadata={onOpenMetadata}
            />
          </div>
        </CardContent>
      </Card>

      {pagination && (
        <Card className="shadow-sm py-0">
          <CardContent>
            <TablePagination
              pagination={pagination}
              onPageChange={onPageChange}
              onLimitChange={(l) => {
                onLimitChange(l);
                onPageChange(1);
              }}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
