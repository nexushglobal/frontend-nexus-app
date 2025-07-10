import { User, FileText, Package, History, Settings } from "lucide-react";

export const paymentDetailMenuSections = [
  {
    id: "overview",
    label: "Resumen",
    icon: User,
    description: "Vista general del pago",
  },
  {
    id: "details",
    label: "Detalles",
    icon: FileText,
    description: "Información detallada",
  },
  {
    id: "items",
    label: "Elementos",
    icon: Package,
    description: "Items del pago",
  },
  {
    id: "timeline",
    label: "Cronología",
    icon: History,
    description: "Historial de cambios",
  },
  {
    id: "metadata",
    label: "Metadata",
    icon: Settings,
    description: "Información técnica",
  },
] as const;
