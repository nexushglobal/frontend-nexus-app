import RegisterPage from '@/features/user/pages/RegisterPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro | Nexus',
  description:
    'Completa tu registro para acceder a todas las funcionalidades de Nexus',
};

export default function Page() {
  return <RegisterPage />;
}
