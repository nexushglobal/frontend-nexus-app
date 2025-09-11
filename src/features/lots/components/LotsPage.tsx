'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageHeader } from '@/features/shared/components/common/PageHeader';
import { AlertCircle, Building2, Loader2 } from 'lucide-react';
import { useProjects } from '../hooks/useLotsQueries';
import { useLotsNavigationStore } from '../stores/lots-navigation.store';
import { LotsView } from './LotsView';
import { ProjectsGrid } from './ProjectsGrid';

export function LotsPage() {
  const { currentView, selectedProject, selectProject, backToProjects } =
    useLotsNavigationStore();


  const { data: projectsData, isLoading, error, isError } = useProjects();

  if (isError) {
    return (
      <div className="container space-y-6">
        <ProjectsPageHeader />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los proyectos:{' '}
            {error?.message || 'Error desconocido'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container space-y-6">
        <ProjectsPageHeader />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      {currentView === 'projects' && (
        <>
          <ProjectsPageHeader />
          <ProjectsGrid
            projects={projectsData?.projects || []}
            onProjectSelect={selectProject}
            isLoading={isLoading}
          />
        </>
      )}

      {currentView === 'lots' && selectedProject && (
        <LotsView project={selectedProject} onBackToProjects={backToProjects} />
      )}
    </div>
  );
}

function ProjectsPageHeader() {
  return (
    <PageHeader
      title="Lotes Disponibles"
      subtitle="Explora nuestros proyectos y encuentra el lote perfecto para ti"
      variant="gradient"
      icon={Building2}
      className="mb-0"
    />
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <h3 className="text-lg font-semibold mb-2">Cargando proyectos</h3>
      <p className="text-sm text-muted-foreground">
        Estamos buscando los proyectos disponibles...
      </p>
    </div>
  );
}
