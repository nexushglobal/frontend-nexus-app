import { Clock, CreditCard, FileText, Receipt } from "lucide-react";

export const paymentDetailMenuSections = [
  {
    id: "overview",
    label: "Resumen",
    icon: Receipt,
    description: "Información general del pago",
  },
  {
    id: "details",
    label: "Detalles",
    icon: FileText,
    description: "Información detallada del pago",
  },
  {
    id: "items",
    label: "Elementos",
    icon: CreditCard,
    description: "Items y transacciones asociadas",
  },
  {
    id: "timeline",
    label: "Historial",
    icon: Clock,
    description: "Cronología del pago",
  },
  {
    id: "metadata",
    label: "Metadatos",
    icon: FileText,
    description: "Información adicional",
  },
];
