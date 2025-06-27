// import { PageHeader } from '@/components/common/PageHeader';
import PaymentsTableSkeleton from './components/PaymentsTableSkeleton';

export default function Loading() {
    return (
        <div className="container py-8">
            {/* <PageHeader
                title="Mis Pagos"
                subtitle="Gestiona y revisa el historial de tus pagos realizados"
                className="mb-6"
                variant="gradient"
            /> */}
            <PaymentsTableSkeleton />
        </div>
    );
}