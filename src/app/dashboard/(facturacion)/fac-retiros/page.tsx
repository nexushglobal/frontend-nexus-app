import AdminWithdrawalsPage from '@/features/withdrawals/components/pages/AdminWithdrawalsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retiros | Administración',
  description: 'Listado de solicitudes de retiro para revisión y gestión',
};

export default function Page() {
  return <AdminWithdrawalsPage />;
}
