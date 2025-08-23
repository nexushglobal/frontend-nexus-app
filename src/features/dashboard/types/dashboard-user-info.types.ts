export interface UserData {
  firstName: string;
  lastName: string;
  birthdate: string;
  ruc: string | null;
  razonSocial: string | null;
  referralCode: string;
  referrerCode: string;
  referralsCount: number;
}

export interface MembershipData {
  hasMembership: boolean;
  membership: {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    planName: string;
    minimumReconsumptionAmount: number;
  } | null;
}

export interface PointData {
  availablePoints: number;
  availableLotPoints: number;
  monthlyVolume: {
    leftVolume: number;
    rightVolume: number;
    monthStartDate: string;
    monthEndDate: string;
  } | null;
  rank: {
    name: string;
  } | null;
  weeklyVolume: {
    leftVolume: number;
    rightVolume: number;
    weekStartDate: string;
    weekEndDate: string;
  } | null;
}

export interface DashboardUserInfoResponse {
  userData: UserData;
  membershipData: MembershipData;
  pointData: PointData;
}
