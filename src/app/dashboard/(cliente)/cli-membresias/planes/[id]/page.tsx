import MembershipPlanDetailPage from '@/features/membership/pages/MembershipPlanDetailPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Detalle del Plan | Membresías',
    description: 'Información detallada del plan de membresía y opciones de suscripción'
};

interface PageProps {
    params: {
        id: string;
    };
}

export default function Page({ params }: PageProps) {
    return <MembershipPlanDetailPage />;
}