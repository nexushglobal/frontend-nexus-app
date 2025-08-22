import { MonthlyVolumePage } from '@/features/point/components/pages/MonthlyVolumePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volúmenes Mensuales | Dashboard',
  description:
    'Consulta tus volúmenes mensuales de puntos y rangos asignados en el sistema',
};

export default function Page() {
  return <MonthlyVolumePage />;
}