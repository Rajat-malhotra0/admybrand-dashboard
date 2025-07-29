import apiClient from './client';
import {
  DashboardData,
  CampaignStat,
  Influencer,
  DemographicData,
  InterestData,
  CreateInfluencerRequest,
  UpdateInfluencerRequest,
  CreateCampaignStatRequest,
  UpdateCampaignStatRequest,
} from './types';

export const dashboardApi = {
  // Get all dashboard data
  getDashboardData: () => apiClient.get<DashboardData>('/dashboard'),
  
  // Campaign Stats
  getCampaignStats: () => apiClient.get<CampaignStat[]>('/campaign-stats'),
  createCampaignStat: (data: CreateCampaignStatRequest) => 
    apiClient.post<CampaignStat>('/campaign-stats', data),
  updateCampaignStat: (id: number, data: UpdateCampaignStatRequest) => 
    apiClient.put<CampaignStat>(`/campaign-stats/${id}`, data),
  deleteCampaignStat: (id: number) => 
    apiClient.delete(`/campaign-stats/${id}`),
    
  // Influencers
  getInfluencers: () => apiClient.get<Influencer[]>('/influencers'),
  createInfluencer: (data: CreateInfluencerRequest) => 
    apiClient.post<Influencer>('/influencers', data),
  updateInfluencer: (id: number, data: UpdateInfluencerRequest) => 
    apiClient.put<Influencer>(`/influencers/${id}`, data),
  deleteInfluencer: (id: number) => 
    apiClient.delete(`/influencers/${id}`),
    
  // Demographics
  getDemographics: () => apiClient.get<DemographicData[]>('/demographics'),
  updateDemographic: (id: number, data: Partial<DemographicData>) => 
    apiClient.put<DemographicData>(`/demographics/${id}`, data),
    
  // Interests
  getInterests: () => apiClient.get<InterestData[]>('/interests'),
  updateInterest: (id: number, data: Partial<InterestData>) => 
    apiClient.put<InterestData>(`/interests/${id}`, data),
  
  // Utility
  resetData: () => apiClient.post('/reset'),
};
