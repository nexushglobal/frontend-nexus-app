import { PaymentsAdminPage } from '@/features/payment/components/pages/PaymentAdminPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pagos | Dashboard',
    description: 'Gestiona y revisa el historial de los pagos realizados'
}

interface PageProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    const filters = await searchParams
    return <PaymentsAdminPage searchParams={filters} />
}