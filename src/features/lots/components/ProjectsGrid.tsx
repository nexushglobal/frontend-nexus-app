'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import type { Project } from '../types/lots.types';

interface ProjectsGridProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  isLoading?: boolean;
}

export function ProjectsGrid({ projects, onProjectSelect, isLoading }: ProjectsGridProps) {
  if (isLoading) {
    return <ProjectsGridSkeleton />;
  }

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={() => onProjectSelect(project)}
        />
      ))}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/5 to-primary/10">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Building2 className="h-16 w-16 text-primary/40" />
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge variant={project.isActive ? "default" : "secondary"}>
              {project.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Moneda: {project.currency}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
            <div className="text-center">
              <div className="font-semibold text-primary">{project.stageCount}</div>
              <div className="text-xs text-muted-foreground">Etapas</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{project.blockCount}</div>
              <div className="text-xs text-muted-foreground">Manzanas</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">{project.activeLotCount}</div>
              <div className="text-xs text-muted-foreground">Disponibles</div>
            </div>
          </div>

          <Button 
            onClick={onSelect}
            className="w-full gap-2"
            variant="outline"
          >
            <Package className="h-4 w-4" />
            Ver Lotes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-2">
          <CardContent className="p-0">
            <div className="h-48 bg-muted animate-pulse rounded-t-lg" />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="text-center space-y-2">
                    <div className="h-5 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyProjectsState() {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">
          No hay proyectos disponibles
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Por el momento no hay proyectos con lotes disponibles para mostrar.
        </p>
      </CardContent>
    </Card>
  );
}