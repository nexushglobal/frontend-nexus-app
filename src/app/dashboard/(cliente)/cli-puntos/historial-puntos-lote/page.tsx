import { getUserPointsLotAction } from '@/features/point/action/get-points.action';
import { PointLotPage } from '@/features/point/components/pages/PointLotPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Puntos Lote | Dashboard',
  description:
    'Consulta tu resumen de puntos de lote y historial de transacciones',
};

export default async function Page() {
  const pointsLotData = await getUserPointsLotAction();

  return <PointLotPage initialPointsLotData={pointsLotData} />;
}
