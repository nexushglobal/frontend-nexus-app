import { PaymentAdminDetailPage } from '@/features/payment/components/pages/PaymentAdminDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Detalle de Pago | Dashboard Admin'
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params
    return <PaymentAdminDetailPage paymentId={id} />
}