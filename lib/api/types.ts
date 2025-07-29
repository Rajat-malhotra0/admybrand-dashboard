// TypeScript interfaces for API data types

export interface CampaignStat {
  id: number;
  title: string;
  value: string;
  icon: string;
  description?: string;
}

export interface Influencer {
  id: number;
  name: string;
  projects: number;
  followers: string;
}

export interface DemographicData {
  label: string;
  male: number;
  female: number;
}

export interface InterestData {
  label: string;
  value: number;
}

export interface DashboardData {
  platforms: {
    [key: string]: PlatformData;
  };
  campaignStats: CampaignStat[];
  influencerData: Influencer[];
  demographicsData: DemographicData[];
  interestsData: InterestData[];
}

export interface PlatformData {
  campaignStats: CampaignStat[];
  influencerData: Influencer[];
  demographicsData: DemographicData[];
  interestsData: InterestData[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  error: string;
  code?: string;
  timestamp?: string;
}

// Request types for creating/updating data
export type CreateInfluencerRequest = Omit<Influencer, "id">;
export type UpdateInfluencerRequest = Partial<Omit<Influencer, "id">>;
export type CreateCampaignStatRequest = Omit<CampaignStat, "id">;
export type UpdateCampaignStatRequest = Partial<Omit<CampaignStat, "id">>;
