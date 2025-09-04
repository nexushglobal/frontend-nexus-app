import { Metadata } from 'next';
import { ReportsDownloadForm } from '@/features/reports/components/ReportsDownloadForm';

export const metadata: Metadata = {
  title: 'Reportes | Nexus Global Network',
  description: 'Genera y descarga reportes personalizados',
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ReportsDownloadForm />
    </div>
  );
}