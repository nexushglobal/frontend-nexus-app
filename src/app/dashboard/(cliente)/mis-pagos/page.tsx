import { PaymentUserPage } from '@/features/payment/components/pages/PaymentUserPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mis Pagos | Dashboard',
    description: 'Consulta el historial de tus pagos realizados'
}

export default function Page() {
    return <PaymentUserPage />
}