import { ReferralsPage } from '@/features/team/components/pages/ReferralsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mis Referidos | Dashboard',
  description: 'Consulta la lista de tus referidos directos'
}

export default function Page() {
  return <ReferralsPage />
}