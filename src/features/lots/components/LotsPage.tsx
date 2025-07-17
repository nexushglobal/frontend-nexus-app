"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, AlertCircle } from "lucide-react";
import { lotsService } from "../services/lotsService";
import { ProjectCard } from "./ProjectCard";
import { LotsFilters } from "./LotsFilters";
import { LotsTable } from "./LotsTable";
import type {
  Project,
  Stage,
  Block,
  Lot,
  LotsFilters as LotsFiltersType,
} from "../types/lots.types";

export function LotsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [stages, setStages] = useState<Stage[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [filters, setFilters] = useState<LotsFiltersType>({
    projectId: null,
    stageId: null,
    blockId: null,
  });

  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [isLoadingLots, setIsLoadingLots] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        setError(null);
        const response = await lotsService.getProjects();
        if (response.total > 0) {
          const activeProjects = response.projects.filter((p) => p.isActive);
          setProjects(activeProjects);
        } else setError("No hay proyectos disponibles");
      } catch (err) {
        setError("Error de conexión al cargar proyectos");
        console.error("Error loading projects:", err);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setStages([]);
      return;
    }

    const loadStages = async () => {
      try {
        setIsLoadingStages(true);
        setError(null);
        const response = await lotsService.getStages(selectedProject.id);
        if (response) setStages(response);
        else setError("Error al cargar las etapas");
      } catch (err) {
        setError("Error de conexión al cargar etapas");
        console.error("Error loading stages:", err);
      } finally {
        setIsLoadingStages(false);
      }
    };

    loadStages();
  }, [selectedProject]);

  useEffect(() => {
    if (!filters.stageId) {
      setBlocks([]);
      return;
    }

    const loadBlocks = async () => {
      try {
        setIsLoadingBlocks(true);
        setError(null);
        const response = await lotsService.getBlocks(filters.stageId!);
        if (response) setBlocks(response);
        else setError("Error al cargar los bloques");
      } catch (err) {
        setError("Error de conexión al cargar bloques");
        console.error("Error loading blocks:", err);
      } finally {
        setIsLoadingBlocks(false);
      }
    };

    loadBlocks();
  }, [filters.stageId]);

  useEffect(() => {
    if (!filters.blockId) {
      setLots([]);
      return;
    }

    const loadLots = async () => {
      try {
        setIsLoadingLots(true);
        setError(null);
        const response = await lotsService.getLots(filters.blockId!);

        if (response) {
          const activeLots = response.filter((lot) => lot.status === "Activo");
          setLots(activeLots);
        } else setError("Error al cargar los lotes");
      } catch (err) {
        setError("Error de conexión al cargar lotes");
        console.error("Error loading lots:", err);
      } finally {
        setIsLoadingLots(false);
      }
    };

    loadLots();
  }, [filters.blockId]);

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setFilters({
      projectId: project.id,
      stageId: null,
      blockId: null,
    });
    setLots([]);
    setError(null);
  }, []);

  const handleFiltersChange = useCallback((newFilters: LotsFiltersType) => {
    setFilters(newFilters);
    if (!newFilters.blockId) {
      setLots([]);
    }
    setError(null);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      stageId: null,
      blockId: null,
    }));
    setLots([]);
    setError(null);
  }, []);

  const handleBackToProjects = useCallback(() => {
    setSelectedProject(null);
    setFilters({
      projectId: null,
      stageId: null,
      blockId: null,
    });
    setStages([]);
    setBlocks([]);
    setLots([]);
    setError(null);
  }, []);

  if (isLoadingProjects) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Lotes Libres</h1>
            <p className="text-muted-foreground">
              Gestiona y visualiza los lotes disponibles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Lotes Activos</h1>
          <p className="text-muted-foreground">
            {selectedProject
              ? `Lotes del proyecto ${selectedProject.name}`
              : "Selecciona un proyecto para ver sus lotes disponibles"}
          </p>
        </div>
        {selectedProject && (
          <Button
            variant="outline"
            onClick={handleBackToProjects}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Proyectos
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

          {projects.length === 0 ? (
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
                      {selectedProject.activeLotCount} lotes activos de{" "}
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
