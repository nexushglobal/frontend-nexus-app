import { getUserPointsAction } from '@/features/point/action/get-points.action';
import { PointsPage } from '@/features/point/components/pages/PointsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Puntos | Dashboard',
  description: 'Consulta tu resumen de puntos y historial de transacciones',
};

export default async function Page() {
  const pointsData = await getUserPointsAction();

  return <PointsPage initialPointsData={pointsData} />;
}
