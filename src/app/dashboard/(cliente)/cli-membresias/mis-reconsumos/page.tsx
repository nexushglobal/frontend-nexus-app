import MembershipReconsumptionsPage from '@/features/membership/pages/MembershipReconsumptionsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Reconsumos | Dashboard',
  description: 'Consulta y gestiona los reconsumos de tu membresía',
};

export default function Page() {
  return <MembershipReconsumptionsPage />;
}
