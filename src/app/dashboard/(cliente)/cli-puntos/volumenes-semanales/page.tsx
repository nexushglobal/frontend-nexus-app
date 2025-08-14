import { WeeklyVolumePage } from '@/features/point/components/pages/WeeklyVolumePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volúmenes Semanales | Dashboard',
  description:
    'Consulta tus volúmenes semanales de puntos y comisiones ganadas',
};

export default function Page() {
  return <WeeklyVolumePage />;
}
