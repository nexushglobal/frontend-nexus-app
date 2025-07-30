import { HistoryPointsPage } from '@/features/point/components/pages/HistoryPointsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Historial de puntos | Dashboard',
  description: 'Consulta tus puntos disponibles y el historial de movimientos',
};

export default function Page() {
  return <HistoryPointsPage />;
}
