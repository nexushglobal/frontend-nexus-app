'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, Loader2, Network, TreePine, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useReferrals } from '../../hooks/useReferralsQuery';
import { useReferralsFiltersStore } from '../../stores/referrals-filters.store';
import { ReferralsCards } from '../referrals/ReferralsCards';
import { ReferralsFilters } from '../referrals/ReferralsFilters';
import { ReferralsTable } from '../referrals/ReferralsTable';

export function ReferralsPage() {
  const { filters, setFilter, setFilters } = useReferralsFiltersStore();

  const queryParams = useMemo(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
  }, [filters]);

  const { data, isLoading, error, isError } = useReferrals(queryParams);

  const handlePageChange = (page: number) => {
    setFilter('page', page);
  };

  const handleLimitChange = (limit: number) => {
    setFilters({ limit, page: 1 });
  };

  if (isError) {
    return (
      <div className="container space-y-6">
        <EnhancedReferralsHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar tus referidos:{' '}
            {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <EnhancedReferralsHeader />

      <div className="space-y-6">
        {/* Filters Section */}
        <Card className="shadow-sm py-0">
          <CardContent className="py-4">
            <ReferralsFilters isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Content Section */}
        {isLoading && !data && <LoadingState />}

        {data && (
          <>
            {/* Stats Header */}
            <Card className="shadow-sm">
              <CardContent className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {data.currentUser.totalDirectUsers}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de Referidos
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {data.result.pagination.total}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Registros Encontrados
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {data.result.pagination.page}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      de{' '}
                      {Math.ceil(
                        data.result.pagination.total /
                          data.result.pagination.limit,
                      )}{' '}
                      páginas
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <ReferralsTable data={data.result.items} isLoading={isLoading} />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <ReferralsCards data={data.result.items} />
            </div>

            {/* Pagination */}
            {data.result.items.length > 0 && (
              <Card className="shadow-sm py-0">
                <CardContent className="py-3">
                  <TablePagination
                    pagination={data.result.pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {data && data.result.items.length === 0 && <EmptyReferralsState />}
      </div>
    </div>
  );
}

function EnhancedReferralsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <PageHeader
        title="Mis Referidos"
        subtitle="Consulta la lista de tus referidos directos"
        variant="gradient"
        icon={Users}
        className="mb-0"
      />

      <div className="flex items-center gap-3">
        <Link href="/dashboard/cli-mi-equipo/arbol">
          <Button variant="outline" className="gap-2">
            <TreePine className="h-4 w-4" />
            Ver Árbol
          </Button>
        </Link>

        <Link href="/dashboard/cli-puntos/volumenes-semanales">
          <Button className="gap-2">
            <Network className="h-4 w-4" />
            Volúmenes
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Cargando referidos</h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando tu equipo directo...
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyReferralsState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No tienes referidos registrados
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Cuando invites personas a unirse a Nexus Global Network usando tu
          código de referido, aparecerán aquí como parte de tu equipo directo.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/dashboard/cli-perfil">
            <Button className="gap-2">
              <Network className="h-4 w-4" />
              Ver mi código de referido
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
