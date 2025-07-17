"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MapPin, Target } from "lucide-react";
import type { Project } from "../types/lots.types";
import { formatDate } from "@features/shared/utils/formatCurrency";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
}

export function ProjectCard({
  project,
  isSelected,
  onSelect,
}: ProjectCardProps) {
  const getAvailabilityColor = (activeLots: number, totalLots: number) => {
    const percentage = (activeLots / totalLots) * 100;
    if (percentage >= 70)
      return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400";
    if (percentage >= 40)
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400";
    return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "ring-2 ring-primary shadow-lg border-primary/50"
          : "hover:border-primary/30"
      }`}
      onClick={() => onSelect(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {project.name}
          </CardTitle>
          <Badge variant="secondary" className="font-medium">
            {project.currency}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estado del proyecto */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estado</span>
          <Badge
            variant={project.isActive ? "default" : "secondary"}
            className={
              project.isActive ? "bg-green-500 hover:bg-green-600" : ""
            }
          >
            {project.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        {/* Estadísticas en grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Etapas</span>
            </div>
            <span className="text-lg font-semibold">{project.stageCount}</span>
          </div>

          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Bloques</span>
            </div>
            <span className="text-lg font-semibold">{project.blockCount}</span>
          </div>
        </div>

        {/* Disponibilidad de lotes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Lotes disponibles</span>
            <span
              className={`font-medium px-2 py-1 rounded-full text-xs ${getAvailabilityColor(
                project.activeLotCount,
                project.lotCount
              )}`}
            >
              {project.activeLotCount} de {project.lotCount}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(project.activeLotCount / project.lotCount) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Fecha de creación */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
          <Calendar className="h-3 w-3" />
          <span>Creado el {formatDate(project.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
