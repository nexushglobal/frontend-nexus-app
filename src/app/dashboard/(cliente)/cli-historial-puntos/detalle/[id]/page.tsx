import HistoryPointDetailPage from '@/features/point/components/pages/HistoryPointsDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Transacción | Dashboard',
  description: 'Información detallada de la transacción y sus pagos asociados',
};
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <HistoryPointDetailPage id={id} />;
}
