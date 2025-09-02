import BannerAdminPage from '@/features/dashboard/components/pages/BannerAdminPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Banners | Dashboard',
  description: 'Administra los banners promocionales de la plataforma',
};

export default function Page() {
  return <BannerAdminPage />;
}
