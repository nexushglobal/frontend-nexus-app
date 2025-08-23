import { ActiveBannersCarousel } from '@/features/dashboard/components/client/ActiveBannersCarousel';
import { DashboardUserInfo } from '@/features/dashboard/components/client/DashboardUserInfo';

export default function HomeDashboard() {
  return (
    <div className="container mx-auto  space-y-8">
      <ActiveBannersCarousel
        autoplayInterval={6000}
        showControls={true}
        showIndicators={true}
        className="mb-5"
      />

      <DashboardUserInfo />
    </div>
  );
}
