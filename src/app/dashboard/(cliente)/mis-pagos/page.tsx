import { PaymentsPage } from '@/features/payment/components/PaymentsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mis Pagos | Dashboard',
    description: 'Gestiona y revisa el historial de tus pagos realizados'
}

interface PageProps {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    const filters = await searchParams
    return <PaymentsPage searchParams={filters} />
}