'use client';
import { ActiveBannersCarousel } from '@/features/dashboard/components/client/ActiveBannersCarousel';
import { DashboardUserInfo } from '@/features/dashboard/components/client/DashboardUserInfo';
import { FacQuickAccess } from '@/features/dashboard/components/client/FacQuickAccess';
import { useSession } from 'next-auth/react';

export default function HomeDashboard() {
  const { data: session } = useSession();
  const roleCode = session?.user.role?.code;

  return (
    <div className="container mx-auto space-y-8">
      {roleCode === 'CLI' && (
        <>
          <ActiveBannersCarousel
            autoplayInterval={6000}
            showControls
            showIndicators
            className="mb-5"
          />
          <DashboardUserInfo />
        </>
      )}
      {roleCode === 'FAC' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenido
              {session?.user.firstName ? `, ${session.user.firstName}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Accede rápidamente a las secciones de facturación.
            </p>
          </div>
          <FacQuickAccess />
        </div>
      )}
    </div>
  );
}
