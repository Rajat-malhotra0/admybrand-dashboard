"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CountryData {
  id: string;
  name: string;
  value: number;
  coordinates: [number, number];
}

export interface CampaignStat {
  id: number;
  title: string;
  value: string;
  icon: string;
  description: string;
  rawValue?: number; // For calculations
}

export interface LeadData {
  id: number;
  name: string;
  projects: number;
  followers: string;
  followersCount?: number; // For calculations
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
  countries: CountryData[];
  campaignStats: CampaignStat[];
  leads: LeadData[];
  demographics: DemographicData[];
  interests: InterestData[];
}

interface DashboardDataContextType {
  data: DashboardData;
  updateCountryData: (id: string, newValue: number) => void;
  updateCampaignStat: (id: number, field: keyof CampaignStat, value: any) => void;
  updateLead: (id: number, field: keyof LeadData, value: any) => void;
  updateDemographic: (label: string, field: 'male' | 'female', value: number) => void;
  updateInterest: (label: string, value: number) => void;
  addCountry: (country: CountryData) => void;
  removeCountry: (id: string) => void;
  resetData: () => void;
}

const initialData: DashboardData = {
  countries: [
    { id: "CAN", name: "Canada", coordinates: [-106.3468, 56.1304], value: 87142 },
    { id: "DEU", name: "Germany", coordinates: [10.4515, 51.1657], value: 90069 },
    { id: "IDN", name: "Indonesia", coordinates: [113.9213, -0.7893], value: 120904 },
    { id: "URY", name: "Uruguay", coordinates: [-55.7658, -32.5228], value: 85321 },
    { id: "USA", name: "United States", coordinates: [-95.7129, 37.0902], value: 235000 },
    { id: "GBR", name: "United Kingdom", coordinates: [-3.4360, 55.3781], value: 156789 },
  ],
  campaignStats: [
    {
      id: 1,
      title: "Total Reach",
      value: "2.4M",
      rawValue: 2400000,
      icon: "TrendingUp",
      description: "+12% from last month",
    },
    {
      id: 2,
      title: "Engagement",
      value: "18,439",
      rawValue: 18439,
      icon: "Users",
      description: "+4.2% from last week",
    },
    {
      id: 3,
      title: "Impressions",
      value: "1.2M",
      rawValue: 1200000,
      icon: "Eye",
      description: "+8.1% from last month",
    },
    {
      id: 4,
      title: "Conversions",
      value: "542",
      rawValue: 542,
      icon: "Target",
      description: "+16% from last month",
    },
  ],
  leads: [
    {
      id: 1,
      name: "Sarah Johnson",
      projects: 12,
      followers: "2.4M",
      followersCount: 2400000,
    },
    {
      id: 2,
      name: "Mike Chen",
      projects: 8,
      followers: "1.8M",
      followersCount: 1800000,
    },
    {
      id: 3,
      name: "Alex Rivera",
      projects: 15,
      followers: "980K",
      followersCount: 980000,
    },
    {
      id: 4,
      name: "Jessica Williams",
      projects: 9,
      followers: "1.5M",
      followersCount: 1500000,
    },
    {
      id: 5,
      name: "David Brown",
      projects: 11,
      followers: "2.1M",
      followersCount: 2100000,
    },
    {
      id: 6,
      name: "Lisa Wang",
      projects: 7,
      followers: "890K",
      followersCount: 890000,
    },
    {
      id: 7,
      name: "Carlos Garcia",
      projects: 13,
      followers: "1.7M",
      followersCount: 1700000,
    },
    {
      id: 8,
      name: "Maya Patel",
      projects: 10,
      followers: "1.3M",
      followersCount: 1300000,
    },
    {
      id: 9,
      name: "Ryan Thompson",
      projects: 14,
      followers: "2.8M",
      followersCount: 2800000,
    },
    {
      id: 10,
      name: "Emily Davis",
      projects: 6,
      followers: "750K",
      followersCount: 750000,
    },
    {
      id: 11,
      name: "James Wilson",
      projects: 16,
      followers: "3.2M",
      followersCount: 3200000,
    },
    {
      id: 12,
      name: "Sofia Martinez",
      projects: 8,
      followers: "1.1M",
      followersCount: 1100000,
    },
  ],
  demographics: [
    { label: "18-24", male: 25, female: 30 },
    { label: "25-34", male: 35, female: 28 },
    { label: "35-44", male: 20, female: 25 },
    { label: "45-54", male: 12, female: 12 },
    { label: "55+", male: 8, female: 5 },
  ],
  interests: [
    { label: "Fashion", value: 85 },
    { label: "Beauty", value: 72 },
    { label: "Lifestyle", value: 68 },
    { label: "Tech", value: 45 },
    { label: "Sports", value: 35 },
    { label: "Travel", value: 52 },
  ],
};

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const DashboardDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>(initialData);

  const updateCountryData = useCallback((id: string, newValue: number) => {
    setData(prev => ({
      ...prev,
      countries: prev.countries.map(country =>
        country.id === id ? { ...country, value: newValue } : country
      )
    }));
  }, []);

  const updateCampaignStat = useCallback((id: number, field: keyof CampaignStat, value: any) => {
    setData(prev => ({
      ...prev,
      campaignStats: prev.campaignStats.map(stat => {
        if (stat.id === id) {
          const updatedStat = { ...stat, [field]: value };
          // Auto-format display value if rawValue is updated
          if (field === 'rawValue') {
            updatedStat.value = formatNumber(value);
          }
          return updatedStat;
        }
        return stat;
      })
    }));
  }, []);

  const updateLead = useCallback((id: number, field: keyof LeadData, value: any) => {
    setData(prev => ({
      ...prev,
      leads: prev.leads.map(lead => {
        if (lead.id === id) {
          const updatedLead = { ...lead, [field]: value };
          // Auto-format followers display if followersCount is updated
          if (field === 'followersCount') {
            updatedLead.followers = formatNumber(value);
          }
          return updatedLead;
        }
        return lead;
      })
    }));
  }, []);


  const updateDemographic = useCallback((label: string, field: 'male' | 'female', value: number) => {
    setData(prev => ({
      ...prev,
      demographics: prev.demographics.map(demo =>
        demo.label === label ? { ...demo, [field]: value } : demo
      )
    }));
  }, []);

  const updateInterest = useCallback((label: string, value: number) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.map(interest =>
        interest.label === label ? { ...interest, value } : interest
      )
    }));
  }, []);

  const addCountry = useCallback((country: CountryData) => {
    setData(prev => ({
      ...prev,
      countries: [...prev.countries, country]
    }));
  }, []);

  const removeCountry = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      countries: prev.countries.filter(country => country.id !== id)
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(initialData);
  }, []);

  return (
    <DashboardDataContext.Provider value={{
      data,
      updateCountryData,
      updateCampaignStat,
      updateLead,
      updateDemographic,
      updateInterest,
      addCountry,
      removeCountry,
      resetData,
    }}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  }
  return context;
};

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toLocaleString();
  }
}
