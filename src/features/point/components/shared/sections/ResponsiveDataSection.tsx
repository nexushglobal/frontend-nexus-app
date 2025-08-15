'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TablePagination } from '@/features/shared/components/table/TablePagination';

interface ResponsiveDataSectionProps<TData> {
  data: TData[];
  pagination: any;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  TableComponent: React.ComponentType<{ data: TData[]; isLoading: boolean }>;
  MobileCardsComponent: React.ComponentType<{ data: TData[] }>;
}

export function ResponsiveDataSection<TData>({
  data,
  pagination,
  isLoading,
  onPageChange,
  onLimitChange,
  TableComponent,
  MobileCardsComponent,
}: ResponsiveDataSectionProps<TData>) {
  return (
    <>
      {/* Desktop - Table */}
      <div className="hidden md:block">
        <TableComponent data={data} isLoading={isLoading} />
      </div>

      {/* Mobile - Cards */}
      <div className="md:hidden">
        <MobileCardsComponent data={data} />
      </div>

      {/* Pagination */}
      <Card className="shadow-sm p-1">
        <CardContent>
          <TablePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </>
  );
}
