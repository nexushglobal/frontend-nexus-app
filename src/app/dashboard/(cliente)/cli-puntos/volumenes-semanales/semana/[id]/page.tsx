import { WeeklyVolumeDetailPage } from '@/features/point/components/pages/WeeklyVolumeDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Volumen Semanal | Dashboard',
  description: 'Consulta el detalle completo de un volumen semanal específico',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <WeeklyVolumeDetailPage volumeId={params.id} />;
}
