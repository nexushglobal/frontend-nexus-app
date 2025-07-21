import { useState, useEffect, useCallback } from "react";
import { lotsService } from "../services/lotsService";
import type {
  Project,
  Stage,
  Block,
  Lot,
  LotsFilters,
} from "../types/lots.types";
import { toast } from "sonner";

interface UseLotsState {
  projects: Project[];
  selectedProject: Project | null;
  stages: Stage[];
  blocks: Block[];
  lots: Lot[];
  filters: LotsFilters;

  isLoadingProjects: boolean;
  isLoadingStages: boolean;
  isLoadingBlocks: boolean;
  isLoadingLots: boolean;
}

interface UseLotsActions {
  handleProjectSelect: (project: Project) => void;
  handleFiltersChange: (filters: LotsFilters) => void;
  handleFiltersReset: () => void;
  handleBackToProjects: () => void;
}

interface UseLotsReturn extends UseLotsState, UseLotsActions {}

export function useLots(): UseLotsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [filters, setFilters] = useState<LotsFilters>({
    projectId: null,
    stageId: null,
    blockId: null,
  });

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [isLoadingLots, setIsLoadingLots] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await lotsService.getProjects();

        if (response.total > 0) {
          const activeProjects = response.projects.filter((p) => p.isActive);
          setProjects(activeProjects);
        } else toast.error("No hay proyectos disponibles");
      } catch (err) {
        toast.error("Error de conexión al cargar proyectos");
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
        const response = await lotsService.getStages(selectedProject.id);

        if (response) setStages(response);
        else toast.error("Error al cargar las etapas");
      } catch (err) {
        toast.error("Error de conexión al cargar etapas");
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
        const response = await lotsService.getBlocks(filters.stageId!);

        if (response) setBlocks(response);
        else toast.error("Error al cargar las manzanas");
      } catch (err) {
        toast.error("Error de conexión al cargar manzanas");
        console.error("Error loading manzanas:", err);
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
        const response = await lotsService.getLots(filters.blockId!);

        if (response) {
          const activeLots = response.filter((lot) => lot.status === "Activo");
          setLots(activeLots);
        } else toast.error("Error al cargar los lotes");
      } catch (err) {
        toast.error("Error de conexión al cargar lotes");
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
  }, []);

  const handleFiltersChange = useCallback((newFilters: LotsFilters) => {
    setFilters(newFilters);
    if (!newFilters.blockId) setLots([]);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      stageId: null,
      blockId: null,
    }));
    setLots([]);
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
  }, []);

  return {
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
  };
}
