'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TablePagination } from '@/features/shared/components/table/TablePagination';
import { AlertCircle, ArrowLeft, Loader2, Package } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useAllLots, useBlocks, useStages } from '../hooks/useLotsQueries';
import { useLotsFiltersStore } from '../stores/lots-filters.store';
import type { Project } from '../types/lots.types';
import { LotsFilters } from './LotsFilters';
import { LotsTable } from './LotsTable';

interface LotsViewProps {
  project: Project;
  onBackToProjects: () => void;
}

export function LotsView({ project, onBackToProjects }: LotsViewProps) {
  const {
    page,
    limit,
    term,
    stageId,
    blockId,
    setFilter,
    setFilters,
    resetFilters,
  } = useLotsFiltersStore();

  // Reset filters when project changes
  useEffect(() => {
    resetFilters();
  }, [project.id, resetFilters]);

  const queryParams = useMemo(
    () => ({
      projectId: project.id,
      page,
      limit,
      term,
      stageId,
      blockId,
      enabled: true,
    }),
    [project.id, page, limit, term, stageId, blockId],
  );

  // Queries
  const {
    data: lotsData,
    isLoading: isLoadingLots,
    error: lotsError,
  } = useAllLots(queryParams);

  const { data: stages = [], isLoading: isLoadingStages } = useStages(
    project.id,
  );

  const { data: blocks = [], isLoading: isLoadingBlocks } = useBlocks(
    stageId || '',
    !!stageId,
  );

  // Handlers
  const handleFilterChange = useCallback(
    (filters: { term?: string; stageId?: string; blockId?: string }) => {
      setFilters({
        ...filters,
        page: 1,
      });
    },
    [setFilters],
  );

  const handleStageChange = useCallback(
    (newStageId: string | undefined) => {
      setFilters({
        stageId: newStageId,
        blockId: undefined,
        page: 1,
      });
    },
    [setFilters],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilter('page', newPage);
    },
    [setFilter],
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setFilters({ limit: newLimit, page: 1 });
    },
    [setFilters],
  );

  if (lotsError) {
    return (
      <div className="space-y-6">
        <LotsHeader project={project} onBackToProjects={onBackToProjects} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los lotes:{' '}
            {lotsError?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LotsHeader project={project} onBackToProjects={onBackToProjects} />

      <Card className="shadow-sm py-0">
        <CardContent className="py-4">
          <LotsFilters
            term={term}
            stageId={stageId}
            blockId={blockId}
            stages={stages}
            blocks={blocks}
            isLoadingStages={isLoadingStages}
            isLoadingBlocks={isLoadingBlocks}
            onFilterChange={handleFilterChange}
            onStageChange={handleStageChange}
          />
        </CardContent>
      </Card>

      {isLoadingLots && !lotsData && <LoadingState />}

      {lotsData && (
        <>
          <LotsTable data={lotsData.items} isLoading={isLoadingLots} />

          <Card className="shadow-sm py-0">
            <CardContent>
              <TablePagination
                pagination={lotsData.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                isLoading={isLoadingLots}
              />
            </CardContent>
          </Card>
        </>
      )}

      {lotsData && lotsData.items.length === 0 && (
        <EmptyLotsState projectName={project.name} />
      )}
    </div>
  );
}

interface LotsHeaderProps {
  project: Project;
  onBackToProjects: () => void;
}

function LotsHeader({ project, onBackToProjects }: LotsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToProjects}
          className="gap-2 p-0 h-auto hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Button>

        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Lotes Disponibles
          </h1>
          <p className="text-muted-foreground">
            {project.name} • {project.activeLotCount} lotes disponibles
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">{project.currency}</span>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Cargando lotes disponibles
        </h3>
        <p className="text-sm text-muted-foreground">
          Estamos buscando los lotes del proyecto...
        </p>
      </CardContent>
    </Card>
  );
}

interface EmptyLotsStateProps {
  projectName: string;
}

function EmptyLotsState({ projectName }: EmptyLotsStateProps) {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No hay lotes que coincidan con los filtros
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Intenta ajustar los filtros de búsqueda o selecciona diferentes
          opciones para ver más lotes en {projectName}.
        </p>
      </CardContent>
    </Card>
  );
}
