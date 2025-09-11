import { LotsPage } from '@features/lots/components/LotsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lotes Libres | Dashboard',
  description: 'Visualiza lotes disponibles',
};

export default function Page() {
  return <LotsPage />;
}
