import { TeamPage } from '@/features/team/components/TeamPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mi Equipo | Dashboard',
    description: 'Visualiza y gestiona la estructura de tu red de usuarios'
}

export default function Page() {
    return <TeamPage />
}