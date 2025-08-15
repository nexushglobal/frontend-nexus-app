import { WeeklyVolumeDetailPage } from '@/features/point/components/pages/WeeklyVolumeDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Volumen Semanal | Dashboard',
  description: 'Consulta el detalle completo de un volumen semanal específico',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const volumeId = parseInt(id, 10);

  if (isNaN(volumeId)) {
    throw new Error('ID de volumen semanal inválido');
  }

  return <WeeklyVolumeDetailPage volumeId={volumeId} />;
}
