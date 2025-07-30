const BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const dashboardApi = {
  // Get all dashboard data
  getDashboardData: () => apiRequest('/dashboard'),

  // Platform-specific data
  getPlatformData: (platform: string) => apiRequest(`/platforms/${platform}`),
  getPlatformCampaignStats: (platform: string) => apiRequest(`/platforms/${platform}/campaign-stats`),
  getPlatformLeads: (platform: string) => apiRequest(`/platforms/${platform}/leads`),
  getPlatformDemographics: (platform: string) => apiRequest(`/platforms/${platform}/demographics`),
  getPlatformInterests: (platform: string) => apiRequest(`/platforms/${platform}/interests`),
  updatePlatformData: (platform: string, data: any) => apiRequest(`/platforms/${platform}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Campaign Stats
  getCampaignStats: () => apiRequest('/campaign-stats'),
  createCampaignStat: (data: any) => apiRequest('/campaign-stats', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCampaignStat: (id: number, data: any) => apiRequest(`/campaign-stats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteCampaignStat: (id: number) => apiRequest(`/campaign-stats/${id}`, {
    method: 'DELETE',
  }),

  // Leads
  getLeads: () => apiRequest('/leads'),
  createLead: (data: any) => {
    console.log('Creating lead with data:', data);
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateLead: (id: number, data: any) => apiRequest(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLead: (id: number) => apiRequest(`/leads/${id}`, {
    method: 'DELETE',
  }),

  // Database-backed endpoints
  getDbLeads: () => apiRequest('/db/leads'),
  getDbCampaigns: () => apiRequest('/db/campaigns'),
  getDbDemographics: () => apiRequest('/db/demographics'),
  
  // Direct POST endpoints for database insertion
  createCampaign: (data: any) => {
    console.log('Creating campaign with data:', data);
    return apiRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  createDemographic: (data: any) => {
    console.log('Creating demographic with data:', data);
    return apiRequest('/demographics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Demographics
  getDemographics: () => apiRequest('/demographics'),
  updateDemographic: (id: number, data: any) => apiRequest(`/demographics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Interests
  getInterests: () => apiRequest('/interests'),
  updateInterest: (id: number, data: any) => apiRequest(`/interests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Utility
  resetData: () => apiRequest('/reset', {
    method: 'POST',
  }),
};
