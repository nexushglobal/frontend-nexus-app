import { User, FileText, Package, History, Settings } from "lucide-react";

export const paymentDetailMenuSections = [
  {
    id: "overview",
    label: "Resumen",
    icon: User,
    always: false,
    description: "Vista general del pago",
  },
  {
    id: "details",
    label: "Detalles",
    icon: FileText,
    always: false,

    description: "Información detallada",
  },
  {
    id: "items",
    label: "Elementos",
    icon: Package,
    always: false,

    description: "Items del pago",
  },
  {
    id: "timeline",
    label: "Cronología",
    icon: History,
    always: false,

    description: "Historial de cambios",
  },
  {
    id: "metadata",
    label: "Metadata",
    icon: Settings,
    always: false,

    description: "Información técnica",
  },
] as const;
