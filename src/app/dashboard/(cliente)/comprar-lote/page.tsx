import SaleLotePage from '@features/sale/pages/SaleLotePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comprar Lote | Dashboard',
  description: 'comprar lote',
};

export default function Page() {
  return <SaleLotePage />;
}
