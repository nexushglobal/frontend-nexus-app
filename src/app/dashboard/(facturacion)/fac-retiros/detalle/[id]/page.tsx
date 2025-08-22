import { WithdrawalAdminDetailPage } from '@/features/withdrawals/components/admin/WithdrawalAdminDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle de Retiro | Dashboard Admin',
  description:
    'Información completa y detallada del retiro - Vista Administrador',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <WithdrawalAdminDetailPage withdrawalId={id} />;
}
