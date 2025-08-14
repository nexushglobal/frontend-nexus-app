import { TransactionDetailPage } from '@/features/point/components/pages/TransactionDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Transacción | Dashboard',
  description:
    'Consulta el detalle completo de una transacción específica de puntos',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const transactionId = parseInt(id, 10);

  if (isNaN(transactionId)) {
    throw new Error('ID de transacción inválido');
  }

  return <TransactionDetailPage transactionId={transactionId} />;
}
