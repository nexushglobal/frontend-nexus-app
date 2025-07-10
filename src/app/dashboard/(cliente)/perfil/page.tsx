import { ProfilePage } from '@/features/profile/components/ProfilePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mi Perfil | Dashboard',
    description: 'Gestiona tu información personal y configuración de cuenta'
}

export default function Page() {
    return <ProfilePage />
}