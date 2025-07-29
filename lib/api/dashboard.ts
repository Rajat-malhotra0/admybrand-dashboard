// Stub implementations for build purposes
export const dashboardApi = {
  // Get all dashboard data
  getDashboardData: () => Promise.resolve({ data: { platforms: {}, campaignStats: [], influencerData: [], demographicsData: [], interestsData: [] } }),

  // Platform-specific data
  getPlatformData: (platform: string) => Promise.resolve({ data: { campaignStats: [], influencerData: [], demographicsData: [], interestsData: [] } }),
  getPlatformCampaignStats: (platform: string) => Promise.resolve({ data: [] }),
  getPlatformInfluencers: (platform: string) => Promise.resolve({ data: [] }),
  getPlatformDemographics: (platform: string) => Promise.resolve({ data: [] }),
  getPlatformInterests: (platform: string) => Promise.resolve({ data: [] }),
  updatePlatformData: (platform: string, data: any) => Promise.resolve({ data: {} }),

  // Campaign Stats
  getCampaignStats: () => Promise.resolve({ data: [] }),
  createCampaignStat: (data: any) => Promise.resolve({ data: {} }),
  updateCampaignStat: (id: number, data: any) => Promise.resolve({ data: {} }),
  deleteCampaignStat: (id: number) => Promise.resolve({ data: {} }),

  // Influencers
  getInfluencers: () => Promise.resolve({ data: [] }),
  createInfluencer: (data: any) => Promise.resolve({ data: {} }),
  updateInfluencer: (id: number, data: any) => Promise.resolve({ data: {} }),
  deleteInfluencer: (id: number) => Promise.resolve({ data: {} }),

  // Demographics
  getDemographics: () => Promise.resolve({ data: [] }),
  updateDemographic: (id: number, data: any) => Promise.resolve({ data: {} }),

  // Interests
  getInterests: () => Promise.resolve({ data: [] }),
  updateInterest: (id: number, data: any) => Promise.resolve({ data: {} }),

  // Utility
  resetData: () => Promise.resolve({ data: {} }),
};
