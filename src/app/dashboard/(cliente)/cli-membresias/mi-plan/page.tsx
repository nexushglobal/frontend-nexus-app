import type { Metadata } from 'next';
import MembershipClientDetailPage from '../../../../../features/membership/pages/MembershipClientDetailPage';

export const metadata: Metadata = {
  title: 'Mi Membresía | Dashboard',
  description: 'Detalle de tu membresía, reconsumos y movimientos',
};

export default function Page() {
  return <MembershipClientDetailPage />;
}
