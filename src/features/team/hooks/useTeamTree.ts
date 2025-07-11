"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getTeamTreeAction } from "../actions/get-team-tree";
import type { TeamMember, TeamTreeResponse } from "../types/team.types";

export function useTeamTree(initialUserId: string, initialDepth: number = 2) {
  const [treeData, setTreeData] = useState<TeamTreeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentViewUserId, setCurrentViewUserId] = useState(initialUserId);
  const [currentDepth, setCurrentDepth] = useState(initialDepth);

  const fetchTreeData = useCallback(
    async (userId?: string, depth?: number) => {
      const targetUserId = userId || currentViewUserId;
      const targetDepth = depth || currentDepth;

      try {
        setLoading(true);
        setError(null);

        const response = await getTeamTreeAction(targetDepth, targetUserId);
        setTreeData(response.data || null);
      } catch (err: any) {
        const errorMessage = err.message || "Error al cargar el árbol";
        setError(errorMessage);
        toast.error("Error al cargar el árbol", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [currentViewUserId, currentDepth]
  );

  // Efecto para cargar datos cuando cambian los parámetros
  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  // Navegación a un usuario específico
  const navigateToUser = useCallback((userId: string) => {
    setCurrentViewUserId(userId);
  }, []);

  // Navegar al usuario raíz
  const navigateToRoot = useCallback(() => {
    setCurrentViewUserId(initialUserId);
  }, [initialUserId]);

  // Navegar al padre
  const navigateToParent = useCallback(() => {
    if (treeData?.metadata.canGoUp && treeData?.metadata.parentId) {
      setCurrentViewUserId(treeData.metadata.parentId);
    } else {
      toast.info("No es posible navegar hacia arriba");
    }
  }, [treeData]);

  // Cambiar profundidad
  const changeDepth = useCallback((newDepth: number) => {
    if (newDepth >= 1 && newDepth <= 5) {
      setCurrentDepth(newDepth);
    }
  }, []);

  // Refrescar datos
  const refresh = useCallback(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  // Buscar un miembro en el árbol por ID
  const findMemberById = useCallback(
    (id: string): TeamMember | null => {
      if (!treeData?.tree) return null;

      const searchNode = (node: TeamMember): TeamMember | null => {
        if (node.id === id) return node;

        if (node.children?.left) {
          const found = searchNode(node.children.left);
          if (found) return found;
        }

        if (node.children?.right) {
          const found = searchNode(node.children.right);
          if (found) return found;
        }

        return null;
      };

      return searchNode(treeData.tree);
    },
    [treeData]
  );

  return {
    // Estado
    treeData,
    loading,
    error,
    currentViewUserId,
    currentDepth,

    // Propiedades derivadas
    canGoUp: treeData?.metadata.canGoUp || false,
    isAtRoot: currentViewUserId === initialUserId,
    metadata: treeData?.metadata,

    // Acciones
    navigateToUser,
    navigateToRoot,
    navigateToParent,
    changeDepth,
    refresh,
    findMemberById,
  };
}
