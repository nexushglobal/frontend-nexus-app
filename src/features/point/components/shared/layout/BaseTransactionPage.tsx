'use client';

import { Card, CardContent } from '@/components/ui/card';
import type {
  BaseFilters,
  BaseFiltersStore,
} from '@/features/point/stores/base-filters.store';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { useMemo, type ReactNode } from 'react';
import { ResponsiveDataSection } from '../sections/ResponsiveDataSection';
import { ErrorState } from '../states/ErrorState';
import { LoadingState } from '../states/LoadingState';

interface BaseTransactionPageProps<
  TData,
  TFilters extends BaseFilters = BaseFilters,
  TSummaryData = any,
> {
  // Page configuration
  title: string;
  subtitle: string;
  loadingMessage?: string;

  // Data and state
  summaryData?: TSummaryData;
  transactionsData?: {
    items: TData[];
    pagination: any;
  };
  isLoading: boolean;
  error?: Error | null;
  isError: boolean;

  // Store for filters
  filtersStore: BaseFiltersStore<TFilters>;

  // Hooks for data fetching
  useTransactionsHook: (params: any) => {
    data?: { items: TData[]; pagination: any };
    isLoading: boolean;
    error?: Error | null;
    isError: boolean;
  };

  // Components
  SummaryCardsComponent?: React.ComponentType<{
    data: TSummaryData;
    isLoading: boolean;
  }>;
  FiltersComponent: React.ComponentType<{ isLoading: boolean }>;
  TableComponent: React.ComponentType<{ data: TData[]; isLoading: boolean }>;
  MobileCardsComponent: React.ComponentType<{ data: TData[] }>;

  // Optional customization
  showSummary?: boolean;
  showFilters?: boolean;
  customErrorContent?: ReactNode;
}

export function BaseTransactionPage<
  TData,
  TFilters extends BaseFilters = BaseFilters,
  TSummaryData = any,
>({
  title,
  subtitle,
  loadingMessage = 'Cargando historial de transacciones...',
  summaryData,
  isLoading,
  error,
  isError,
  filtersStore,
  useTransactionsHook,
  SummaryCardsComponent,
  FiltersComponent,
  TableComponent,
  MobileCardsComponent,
  showSummary = true,
  showFilters = true,
  customErrorContent,
}: BaseTransactionPageProps<TData, TFilters, TSummaryData>) {
  const { filters, setFilter, setFilters } = filtersStore;

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters]);

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    isError: transactionsIsError,
  } = useTransactionsHook(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 } as Partial<TFilters>);
  };

  const isDataLoading = isLoading || transactionsLoading;
  const hasError = isError || transactionsIsError;
  const errorToShow = error || transactionsError;

  if (hasError) {
    return (
      <div className="container">
        <PageHeader
          title={title}
          subtitle={subtitle}
          className="mb-6"
          variant="gradient"
        />

        <div className="space-y-6">
          {showSummary && SummaryCardsComponent && summaryData && (
            <SummaryCardsComponent data={summaryData} isLoading={false} />
          )}

          {customErrorContent || (
            <ErrorState title="Error al cargar los datos" error={errorToShow} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader
        title={title}
        subtitle={subtitle}
        className="mb-6"
        variant="gradient"
      />

      <div className="space-y-6">
        {/* Summary Cards */}
        {showSummary && SummaryCardsComponent && summaryData && (
          <SummaryCardsComponent data={summaryData} isLoading={isLoading} />
        )}

        {/* Filters */}
        {showFilters && (
          <Card className="shadow-sm">
            <CardContent>
              <FiltersComponent isLoading={isDataLoading} />
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isDataLoading && !transactionsData && (
          <LoadingState message={loadingMessage} />
        )}

        {/* Table and Cards */}
        {transactionsData && (
          <ResponsiveDataSection
            data={transactionsData.items}
            pagination={transactionsData.pagination}
            isLoading={isDataLoading}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            TableComponent={TableComponent}
            MobileCardsComponent={MobileCardsComponent}
          />
        )}
      </div>
    </div>
  );
}
