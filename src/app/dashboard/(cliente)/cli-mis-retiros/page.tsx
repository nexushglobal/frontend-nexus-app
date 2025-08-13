import ClientWithdrawalsPage from '@/features/withdrawals/components/pages/ClientWithdrawalsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Retiros | Dashboard',
  description: 'Consulta y filtra tus solicitudes de retiro',
};

export default function Page() {
  return <ClientWithdrawalsPage />;
}
