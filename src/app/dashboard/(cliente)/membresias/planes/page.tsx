import { MembershipPlansPage } from '@/features/membership/pages/MembershipPlansPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Planes de Membresía | Dashboard',
    description: 'Elige el plan que mejor se adapte a tus objetivos y necesidades de crecimiento'
}

export default function Page() {
    return <MembershipPlansPage />
}