"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { LotsFilters } from "./LotsFilters";
import { LotsTable } from "./LotsTable";
import { useLots } from "../hooks/useLots";
import { PageHeader } from "@features/shared/components/common/PageHeader";
import CardSkeleton from "./CardSkeleton";

export function LotsPage() {
  const {
    projects,
    selectedProject,
    stages,
    blocks,
    lots,
    filters,
    isLoadingProjects,
    isLoadingStages,
    isLoadingBlocks,
    isLoadingLots,

    handleProjectSelect,
    handleFiltersChange,
    handleFiltersReset,
    handleBackToProjects,
  } = useLots();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Lotes Libres"
        subtitle={
          selectedProject
            ? `Lotes del proyecto ${selectedProject.name}`
            : "Selecciona un proyecto para ver sus lotes disponibles"
        }
        className="mb-6"
        variant="gradient"
        icon={Building2}
        actions={
          selectedProject && (
            <Button
              variant="outline"
              onClick={handleBackToProjects}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Proyectos
            </Button>
          )
        }
      />

      {!selectedProject ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Disponibles</CardTitle>
              <CardDescription>
                Selecciona un proyecto para ver sus lotes activos
              </CardDescription>
            </CardHeader>
          </Card>

          {isLoadingProjects ? (
            <CardSkeleton count={3} />
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No hay proyectos activos disponibles
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contacta al administrador para más información
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={false}
                  onSelect={handleProjectSelect}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedProject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.activeLotCount} lotes activos de&nbsp;
                      {selectedProject.lotCount} totales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Moneda</p>
                  <p className="font-semibold">{selectedProject.currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <LotsFilters
            stages={stages}
            blocks={blocks}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoadingStages={isLoadingStages}
            isLoadingBlocks={isLoadingBlocks}
            onReset={handleFiltersReset}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Lotes Activos
                {lots.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({lots.length} {lots.length === 1 ? "lote" : "lotes"})
                  </span>
                )}
              </h3>
            </div>

            <LotsTable
              data={lots}
              isLoading={isLoadingLots}
              currency={selectedProject.currency}
            />
          </div>
        </div>
      )}
    </div>
  );
}
