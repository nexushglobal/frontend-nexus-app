export const calculateHorizontalSpacing = (
  level: number,
  depth: number
): number => {
  const baseSpacingMap = {
    2: 150,
    3: 110,
    4: 125,
    5: 150,
  };

  const scaleFactorMap = {
    2: 0.8,
    3: 1.4,
    4: 2.1,
    5: 2.5,
  };

  const baseSpacing =
    baseSpacingMap[depth as keyof typeof baseSpacingMap] || 100;
  const scaleFactor =
    scaleFactorMap[depth as keyof typeof scaleFactorMap] || 1.0;
  const levelReduction = Math.pow(0.5, level);
  const depthMultiplier = depth * scaleFactor;

  return baseSpacing * depthMultiplier * levelReduction;
};

/**
 * Obtiene las iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

/**
 * Obtiene el nombre a mostrar con límite de caracteres
 */
export const getDisplayName = (
  member: { fullName?: string; email: string },
  maxLength = 20
): string => {
  if (member.fullName) {
    return member.fullName.length > maxLength
      ? member.fullName.slice(0, maxLength) + "..."
      : member.fullName;
  }
  return member.email.split("@")[0];
};

/**
 * Valida si un usuario tiene hijos en el árbol
 */
export const hasTeamChildren = (member: any): boolean => {
  return !!(member.children?.left || member.children?.right);
};

/**
 * Cuenta el número total de hijos directos
 */
export const countDirectChildren = (member: any): number => {
  return (member.children?.left ? 1 : 0) + (member.children?.right ? 1 : 0);
};

/**
 * Convierte la posición a texto legible
 */
export const getPositionText = (position: "LEFT" | "RIGHT" | null): string => {
  switch (position) {
    case "LEFT":
      return "Izquierda";
    case "RIGHT":
      return "Derecha";
    default:
      return "Raíz";
  }
};

/**
 * Valida parámetros de búsqueda
 */
export const validateSearchParams = (
  search: string,
  page?: number,
  limit?: number
) => {
  const errors: string[] = [];

  if (!search || search.trim().length === 0) {
    errors.push("El término de búsqueda es requerido");
  }

  if (search && search.trim().length < 2) {
    errors.push("El término de búsqueda debe tener al menos 2 caracteres");
  }

  if (page && page < 1) {
    errors.push("La página debe ser mayor a 0");
  }

  if (limit && (limit < 1 || limit > 100)) {
    errors.push("El límite debe estar entre 1 y 100");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Formatea el código de referencia para mostrar
 */
export const formatReferralCode = (code: string): string => {
  return code.toUpperCase();
};

/**
 * Genera un color de badge basado en el estado del usuario
 */
export const getUserStatusColor = (isActive: boolean) => {
  return isActive
    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
};

/**
 * Genera un texto de estado del usuario
 */
export const getUserStatusText = (isActive: boolean): string => {
  return isActive ? "Activo" : "Inactivo";
};
