import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Info,
  PieChart,
  User,
} from 'lucide-react';

export const withdrawalDetailMenuSections = [
  {
    id: 'overview',
    label: 'Resumen General',
    description: 'Vista general del retiro',
    icon: Info,
  },
  {
    id: 'user-info',
    label: 'Información del Usuario',
    description: 'Datos personales y bancarios',
    icon: User,
  },
  {
    id: 'points-breakdown',
    label: 'Desglose de Puntos',
    description: 'Puntos utilizados en el retiro',
    icon: PieChart,
  },
  {
    id: 'payment-history',
    label: 'Historial de Pagos',
    description: 'Pagos asociados a los puntos',
    icon: CreditCard,
  },
  {
    id: 'timeline',
    label: 'Cronología',
    description: 'Historial de estados del retiro',
    icon: Calendar,
  },
  {
    id: 'metadata',
    label: 'Información Técnica',
    description: 'Metadata y detalles técnicos',
    icon: FileText,
  },
] as const;