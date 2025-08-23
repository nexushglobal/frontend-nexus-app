'use client';

import { DashboardUserInfoResponse } from '../../types/dashboard-user-info.types';
import MembershipStatus from './cards/MembershipStatus';
import PointsOverview from './cards/PointsOverview';
import QuickAction from './cards/QuickAction';
import WelcomeHero from './cards/WelcomeHero';

interface DashboardUserInfoCardsProps {
  data: DashboardUserInfoResponse;
}

export function DashboardUserInfoCards({ data }: DashboardUserInfoCardsProps) {
  const { userData, membershipData, pointData } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
      <MembershipStatus membershipData={membershipData} />
      <WelcomeHero userData={userData} />

      <QuickAction pointData={pointData} />
      <PointsOverview pointData={pointData} />
    </div>
  );
}
