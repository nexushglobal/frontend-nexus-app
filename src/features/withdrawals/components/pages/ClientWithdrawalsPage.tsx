'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import {
  AlertCircle,
  Banknote,
  CheckCircle,
  Info,
  Loader2,
  ShoppingCart,
  Store,
  TrendingUp,
  User,
  Wallet,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useClientWithdrawals } from '../../hooks/useWithdrawalsClientQuery';
import { useWithdrawalValidation } from '../../hooks/useWithdrawalValidation';
import { useWithdrawalsClientFiltersStore } from '../../stores/withdrawals-client-filters.store';
import { WithdrawalClient } from '../../types/withdrawals.types';
import { NewWithdrawalModal } from '../client/NewWithdrawalModal';
import { WithdrawalClientSummaryModal } from '../client/WithdrawalClientSummaryModal';
import { WithdrawalsClientCards } from '../client/WithdrawalsClientCards';
import { WithdrawalsClientFilters } from '../client/WithdrawalsClientFilters';
import { WithdrawalsClientTable } from '../client/WithdrawalsClientTable';

export default function ClientWithdrawalsPage() {
  const { filters, setFilter, setFilters } = useWithdrawalsClientFiltersStore();
  const [selected, setSelected] = useState<WithdrawalClient | null>(null);
  const [open, setOpen] = useState(false);
  const [newWithdrawalOpen, setNewWithdrawalOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: any = {
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;

    return params;
  }, [filters]);

  const { data, isLoading, error, isError } = useClientWithdrawals(queryParams);
  const {
    data: validationData,
    isLoading: isValidationLoading,
    error: validationError,
  } = useWithdrawalValidation();

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  const handleOpenSummary = (w: WithdrawalClient) => {
    setSelected(w);
    setOpen(true);
  };

  if (isError) {
    return (
      <div className="container space-y-6">
        <div className="relative overflow-hidden">
          <Alert
            variant="destructive"
            className="border-l-4 border-l-destructive shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <AlertDescription className="font-medium">
                  Error al cargar los retiros
                </AlertDescription>
                <AlertDescription className="text-sm opacity-90">
                  {error?.message || 'Error desconocido'}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      {/* Header Section */}
      <div>
        <EnhancedWithdrawalHeader
          validationData={validationData}
          isValidationLoading={isValidationLoading}
          onNewWithdrawal={() => setNewWithdrawalOpen(true)}
        />
      </div>

      <div className="space-y-8">
        {/* Filters Section */}
        <Card className="border shadow-sm py-0">
          <CardContent className="py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Filtros y búsqueda
              </h3>
            </div>
            <WithdrawalsClientFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Content Section */}
        <div className="space-y-6">
          {isLoading && !data && <LoadingState />}

          {data && (
            <div className="space-y-6">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <WithdrawalsClientTable
                  data={data.items}
                  isLoading={isLoading}
                  onOpenSummary={handleOpenSummary}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                <WithdrawalsClientCards
                  data={data.items}
                  onOpenSummary={handleOpenSummary}
                />
              </div>

              {/* Pagination */}
              <Card className="border shadow-sm py-0">
                <CardContent className="p-0">
                  <TablePagination
                    pagination={data.pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <WithdrawalClientSummaryModal
        open={open}
        onOpenChange={setOpen}
        withdrawal={selected}
      />

      {validationData && (
        <NewWithdrawalModal
          open={newWithdrawalOpen}
          onOpenChange={setNewWithdrawalOpen}
          userInfo={validationData.infoUser}
          availablePoints={validationData.availablePoints}
        />
      )}
    </div>
  );
}

// Enhanced Header Component
interface EnhancedWithdrawalHeaderProps {
  validationData?: any;
  isValidationLoading: boolean;
  onNewWithdrawal: () => void;
}

function EnhancedWithdrawalHeader({
  validationData,
  isValidationLoading,
  onNewWithdrawal,
}: EnhancedWithdrawalHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-xl bg-card border shadow-sm p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary border-2 border-primary/20">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mis Retiros
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  Gestiona y monitorea tus solicitudes de retiro
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/cli-tienda/productos">
              <Button
                variant="outline"
                className="gap-2 transition-colors duration-200 border-primary/30 hover:border-primary hover:bg-primary/5"
              >
                <Store className="h-4 w-4" />
                Explorar tienda
              </Button>
            </Link>

            <Link href="/dashboard/cli-tienda/carrito">
              <Button className="gap-2 transition-colors duration-200">
                <ShoppingCart className="h-4 w-4" />
                Mi Carrito
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Withdrawal Status Section */}
      {isValidationLoading ? (
        <Card className="border shadow-sm py-0">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 border border-info/20">
                <Loader2 className="h-5 w-5 animate-spin text-info" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-semibold text-foreground">
                  Verificando elegibilidad para retiros
                </span>
                <p className="text-sm text-muted-foreground">
                  Estamos validando tu información...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : validationData ? (
        <Card
          className={`border shadow-sm transition-colors duration-200  ${
            validationData.canWithdraw
              ? 'border-success/30 bg-success/5'
              : 'border-warning/30 bg-warning/5'
          }`}
        >
          <CardContent className="">
            {validationData.canWithdraw ? (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 border border-success/30">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-success">
                        ¡Retiros disponibles!
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Puedes solicitar retiros de tus comisiones
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-13">
                    <Banknote className="h-5 w-5 text-primary" />
                    <span className="text-base text-muted-foreground">
                      Puntos disponibles:{' '}
                      <span className="font-bold text-foreground text-lg">
                        {validationData.availablePoints.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                <Button
                  onClick={onNewWithdrawal}
                  size="lg"
                  className="gap-2 px-8 py-3 text-base transition-colors duration-200"
                >
                  <Zap className="h-5 w-5" />
                  Nuevo Retiro
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 border border-warning/30">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-warning">
                      Retiros no disponibles
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Necesitas cumplir algunos requisitos
                    </p>
                  </div>
                </div>

                <div className="pl-13 space-y-4">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-primary" />
                    <span className="text-base text-muted-foreground">
                      Puntos disponibles:{' '}
                      <span className="font-bold text-foreground text-lg">
                        {validationData.availablePoints.toLocaleString()}
                      </span>
                    </span>
                  </div>

                  {validationData.req && validationData.req.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Info className="h-5 w-5 text-info" />
                          <span className="text-base font-semibold text-info">
                            Requerimientos pendientes:
                          </span>
                        </div>
                        <Link
                          href="/dashboard/cli-perfil"
                          className="text-sm text-destructive font-medium hover:underline flex items-center gap-1 border border-destructive/20 px-3 py-1 rounded-full hover:bg-destructive/5 transition-colors duration-200"
                        >
                          <User className="h-4 w-4" />
                          Completar perfil
                        </Link>
                      </div>

                      <div className="flex flex-col ">
                        {validationData.req.map(
                          (requirement: string, index: number) => (
                            <div
                              className="flex items-center gap-3"
                              key={index}
                            >
                              <div className="h-2 w-2 bg-warning rounded-full flex-shrink-0"></div>
                              <span className="text-sm font-medium text-warning">
                                {requirement.charAt(0).toUpperCase() +
                                  requirement.slice(1)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary border border-primary/20">
          <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
        </div>
        <div className="mt-6 text-center space-y-3">
          <h3 className="text-xl font-bold text-foreground">
            Cargando retiros
          </h3>
          <p className="text-base text-muted-foreground max-w-md">
            Estamos buscando tu historial de retiros y validando la
            información...
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="mt-8 w-full max-w-2xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border border-muted/30 animate-pulse"
            >
              <div className="h-4 w-4 bg-muted/60 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted/60 rounded-md w-3/4"></div>
                <div className="h-3 bg-muted/60 rounded-md w-1/2"></div>
              </div>
              <div className="h-8 w-20 bg-muted/60 rounded-md"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
