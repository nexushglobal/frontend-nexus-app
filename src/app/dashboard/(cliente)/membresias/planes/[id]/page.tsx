import MembershipPlanDetailPage from '@/features/membership/pages/MembershipPlanDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Detalle del Plan | Dashboard',
    description: 'Información detallada del plan de membresía y opciones de suscripción'
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params
    return <MembershipPlanDetailPage planId={id} />
}
