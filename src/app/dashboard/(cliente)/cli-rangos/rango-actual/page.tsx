import { CurrentRankPage } from '@/features/point/components/pages/CurrentRankPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rango Actual | Dashboard',
  description:
    'Consulta tu información de rango actual, progreso y requisitos para el siguiente nivel',
};

export default function Page() {
  return <CurrentRankPage />;
}