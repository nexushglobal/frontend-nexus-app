import { ComplaintsAdminPage } from '@/features/complaints/components/pages/ComplaintsAdminPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Libro de Reclamaciones | Dashboard',
    description: 'Gestiona y revisa las quejas y reclamos de los usuarios'
}

export default function Page() {
    return <ComplaintsAdminPage />
}