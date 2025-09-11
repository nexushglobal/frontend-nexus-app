'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { Block, Stage } from '../types/lots.types';

interface LotsFiltersProps {
  term?: string;
  stageId?: string;
  blockId?: string;
  stages?: Stage[];
  blocks?: Block[];
  isLoadingStages?: boolean;
  isLoadingBlocks?: boolean;
  onFilterChange: (filters: {
    term?: string;
    stageId?: string;
    blockId?: string;
  }) => void;
  onStageChange: (stageId: string | undefined) => void;
}

export function LotsFilters({
  term = '',
  stageId,
  blockId,
  stages = [],
  blocks = [],
  isLoadingStages,
  isLoadingBlocks,
  onFilterChange,
  onStageChange,
}: LotsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(term);

  const handleTermChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      onFilterChange({ term: value || undefined, stageId, blockId });
    },
    [onFilterChange, stageId, blockId],
  );

  const handleStageChange = useCallback(
    (value: string | undefined) => {
      const actualValue = value === 'all-stages' ? undefined : value;
      onStageChange(actualValue);
      onFilterChange({ 
        term: searchTerm || undefined, 
        stageId: actualValue, 
        blockId: undefined 
      });
    },
    [onFilterChange, onStageChange, searchTerm],
  );

  const handleBlockChange = useCallback(
    (value: string | undefined) => {
      const actualValue = value === 'all-blocks' ? undefined : value;
      onFilterChange({ 
        term: searchTerm || undefined, 
        stageId, 
        blockId: actualValue 
      });
    },
    [onFilterChange, searchTerm, stageId],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    onStageChange(undefined);
    onFilterChange({ term: undefined, stageId: undefined, blockId: undefined });
  }, [onFilterChange, onStageChange]);

  const hasActiveFilters = searchTerm || stageId || blockId;

  useEffect(() => {
    setSearchTerm(term);
  }, [term]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Buscar lote</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre de lote..."
              value={searchTerm}
              onChange={(e) => handleTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2 min-w-[180px]">
          <Label>Etapa</Label>
          <Select
            value={stageId || 'all-stages'}
            onValueChange={(value) => handleStageChange(value || undefined)}
            disabled={isLoadingStages}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  isLoadingStages ? "Cargando etapas..." : "Seleccionar etapa"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-stages">Todas las etapas</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 min-w-[180px]">
          <Label>Manzana</Label>
          <Select
            value={blockId || 'all-blocks'}
            onValueChange={(value) => handleBlockChange(value || undefined)}
            disabled={isLoadingBlocks || !stageId}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !stageId 
                    ? "Seleccione una etapa"
                    : isLoadingBlocks 
                    ? "Cargando manzanas..." 
                    : "Seleccionar manzana"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-blocks">Todas las manzanas</SelectItem>
              {blocks.map((block) => (
                <SelectItem key={block.id} value={block.id}>
                  {block.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filtros activos:</span>
            {searchTerm && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                Búsqueda: &quot;{searchTerm}&quot;
              </span>
            )}
            {stageId && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                Etapa: {stages.find(s => s.id === stageId)?.name || stageId}
              </span>
            )}
            {blockId && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">
                Manzana: {blocks.find(b => b.id === blockId)?.name || blockId}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}