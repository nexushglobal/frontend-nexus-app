// src/features/lots/components/LotsFilters.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";
import type { Stage, Block, LotsFilters } from "../types/lots.types";

interface LotsFiltersProps {
  stages: Stage[];
  blocks: Block[];
  filters: LotsFilters;
  onFiltersChange: (filters: LotsFilters) => void;
  isLoadingStages?: boolean;
  isLoadingBlocks?: boolean;
  onReset: () => void;
}

export function LotsFilters({
  stages,
  blocks,
  filters,
  onFiltersChange,
  isLoadingStages = false,
  isLoadingBlocks = false,
  onReset,
}: LotsFiltersProps) {
  const handleStageChange = (stageId: string) => {
    onFiltersChange({
      ...filters,
      stageId: stageId === "all" ? null : stageId,
      blockId: null, // Reset block when stage changes
    });
  };

  const handleBlockChange = (blockId: string) => {
    onFiltersChange({
      ...filters,
      blockId: blockId === "all" ? null : blockId,
    });
  };

  const hasActiveFilters = filters.stageId || filters.blockId;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filtros:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Selector de Etapas */}
            <div className="min-w-[200px]">
              <Select
                value={filters.stageId || "all"}
                onValueChange={handleStageChange}
                disabled={isLoadingStages || stages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingStages
                        ? "Cargando etapas..."
                        : stages.length === 0
                        ? "Sin etapas disponibles"
                        : "Seleccionar etapa"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las etapas</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px]">
              <Select
                value={filters.blockId || "all"}
                onValueChange={handleBlockChange}
                disabled={
                  isLoadingBlocks || !filters.stageId || blocks.length === 0
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.stageId
                        ? "Primero selecciona una etapa"
                        : isLoadingBlocks
                        ? "Cargando manzanas..."
                        : blocks.length === 0
                        ? "Sin manzanas disponibles"
                        : "Seleccionar bloque"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos las manzanas</SelectItem>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botón de reset */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Filtros activos:</span>
              {filters.stageId && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Etapa:{" "}
                  {stages.find((s) => s.id === filters.stageId)?.name ||
                    "Seleccionada"}
                </span>
              )}
              {filters.blockId && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Bloque:{" "}
                  {blocks.find((b) => b.id === filters.blockId)?.name ||
                    "Seleccionado"}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
