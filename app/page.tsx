"use client";

import React, { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ConsolidatedHeader from "@/components/ConsolidatedHeader";
import ContentHeader from "@/components/ContentHeader";
import StatCard from "@/components/StatCard";
import AudienceAgeGenderChart from "@/components/AudienceAgeGenderChart";
import RadarChart from "@/components/charts/RadarChart";
import InfluencerTable from "@/components/InfluencerTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { ResponsiveGrid, ResponsiveGridItem } from "@/components/Layout/ResponsiveGrid";
import { useScreenSize } from "@/hooks/useScreenSize";
import { usePlatformData } from "@/hooks/usePlatformData";
import { useCountriesWithData } from "@/hooks/useCountriesWithData";
import { TrendingUp, Users, Eye, Target } from "lucide-react";
import dynamic from "next/dynamic";

const MapChart = dynamic(() => import("@/components/MapChart"), {
  ssr: false,
});

// Fallback data structure for when database is unavailable
const fallbackData = {
  campaignStats: [],
  influencerData: [],
  demographicsData: [],
  interestsData: [],
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "TrendingUp":
      return <TrendingUp className="text-primary" />;
    case "Users":
      return <Users className="text-primary" />;
    case "Eye":
      return <Eye className="text-primary" />;
    case "Target":
      return <Target className="text-primary" />;
    default:
      return <TrendingUp className="text-primary" />;
  }
};

export default function Dashboard() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("LinkedIn");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState(fallbackData);
  const [useBackend, setUseBackend] = useState(true);
  const tabs = ["LinkedIn", "Instagram", "Facebook"];
  
  // ISO to country name mapping
  const isoToCountryName: Record<string, string> = {
    'USA': 'United States',
    'CAN': 'Canada', 
    'DEU': 'Germany',
    'GBR': 'United Kingdom',
    'FRA': 'France',
    'JPN': 'Japan',
    'AUS': 'Australia',
    'BRA': 'Brazil',
    'IND': 'India',
    'CHN': 'China'
  };
  
  // Database country name to ISO code mapping
  const countryNameToIso: Record<string, string> = {
    'US': 'USA',
    'Canada': 'CAN',
    'Germany': 'DEU',
    'United Kingdom': 'GBR',
    'France': 'FRA',
    'Japan': 'JPN',
    'Australia': 'AUS',
    'Brazil': 'BRA',
    'India': 'IND',
    'China': 'CHN'
  };
  
  // ISO to database country name mapping (reverse of countryNameToIso)
  const isoToDbCountryName: Record<string, string> = {
    'USA': 'US',
    'CAN': 'Canada',
    'DEU': 'Germany',
    'GBR': 'United Kingdom',
    'FRA': 'France',
    'JPN': 'Japan',
    'AUS': 'Australia',
    'BRA': 'Brazil',
    'IND': 'India',
    'CHN': 'China'
  };
  
  // Use the unified platform data hook like the admin panel
  const { data: platformData, error: platformError, isLoading: platformLoading, refresh } = usePlatformData(activeTab, useBackend, selectedCountry ? (isoToDbCountryName[selectedCountry] || selectedCountry) : undefined);
  
  // Fetch countries with data from backend
  const { countries: countriesWithData, error: countriesError, isLoading: countriesLoading, refresh: refreshCountries } = useCountriesWithData();

  // Convert database country names to ISO codes for the map
  const mapCountriesWithData = countriesWithData.map(country => countryNameToIso[country] || country);

  // Track platform/country changes for debugging
  // SWR automatically fetches when the key changes, no manual refresh needed
  React.useEffect(() => {
    if (useBackend) {
      console.log('Platform/country changed:', { platform: activeTab, country: selectedCountry });
      // SWR will automatically fetch with the new key - no manual refresh needed
    }
  }, [activeTab, selectedCountry, useBackend]);

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem("dashboardData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setDashboardData(parsed);
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);
  const { isMobile, isTablet, isDesktop, screenSize } = useScreenSize();
  
  // Function to handle country selection
  const handleCountryClick = (countryIso: string) => {
    console.log('Country selected (ISO):', countryIso);
    setSelectedCountry(countryIso);
    setSelectedCountryName(isoToCountryName[countryIso] || countryIso);
  };
  
  // Get current stats based on selected country and platform
  const getCurrentStats = () => {
    // Use backend data if available and backend is enabled
    if (useBackend && platformData && !platformError) {
      return platformData.campaignStats;
    }
    
    // Fallback to mock data structure
    return dashboardData.campaignStats;
  };
  
  // Get current influencer data
  const getCurrentInfluencers = () => {
    // Use backend data if available and backend is enabled
    if (useBackend && platformData && !platformError) {
      return platformData.influencerData;
    }
    return dashboardData.influencerData;
  };
  
  // Get current demographics data
  const getCurrentDemographics = () => {
    // Use backend data if available and backend is enabled
    if (useBackend && platformData && !platformError) {
      return platformData.demographicsData;
    }
    return dashboardData.demographicsData;
  };
  
  // Get current interests data
  const getCurrentInterests = () => {
    // Use backend data if available and backend is enabled
    if (useBackend && platformData && !platformError) {
      return platformData.interestsData;
    }
    return dashboardData.interestsData;
  };

  // Determine if PDF export should be disabled
  const shouldDisablePDF = useBackend && (platformLoading || countriesLoading);

  return (
    <DashboardLayout sidebar={<Sidebar reportRef={reportRef} platform={activeTab} country={selectedCountryName} disabled={shouldDisablePDF} />} reportRef={reportRef}>
      <div ref={reportRef} className="px-4 lg:px-6 py-4 lg:py-6 max-w-full overflow-x-hidden space-y-4 lg:space-y-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <ConsolidatedHeader />
        </header>

        {/* Content Header */}
        <section className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <ContentHeader />
        </section>

        {/* Backend Toggle and Platform Selection */}
        <div className="mb-4 p-4 bg-white rounded-lg border">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useBackend"
                checked={useBackend}
                onChange={(e) => setUseBackend(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="useBackend">Use Backend Data</label>
            </div>
            
            {useBackend && (
              <>
                <button
                  onClick={() => refresh()}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  disabled={platformLoading}
                >
                  {platformLoading ? 'Refreshing...' : 'Refresh Platform Data'}
                </button>
                <button
                  onClick={() => refreshCountries()}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  disabled={countriesLoading}
                >
                  {countriesLoading ? 'Refreshing...' : 'Refresh Countries'}
                </button>
              </>
            )}
            
            {useBackend && countriesLoading && (
              <span className="text-sm text-text-muted">Loading...</span>
            )}
            
            {useBackend && platformError && (
              <span className="text-sm text-red-600">Error loading data</span>
            )}
            
            {useBackend && (
              <div className="text-xs text-text-muted">
                Countries: {countriesWithData.length > 0 ? countriesWithData.join(', ') : 'None'}
              </div>
            )}
          </div>
        </div>

        {/* Social Media Tabs */}
        <div className="flex bg-surface-elevated rounded-lg p-1 w-full lg:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 lg:flex-none font-medium rounded-md transition-colors 
                min-h-[44px] flex items-center justify-center
                px-3 py-2 text-sm lg:px-4 relative
                ${
                  activeTab === tab
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }
              `}
            >
              {tab}
              {platformLoading && activeTab === tab && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Platform Loading/Error Status */}
        {platformError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              Failed to load {activeTab} data. Using cached data instead.
            </p>
          </div>
        )}

        {/* Main Content Grid - Desktop: Stats left, Map right | Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Stats Cards (2x2 grid on desktop) */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCurrentStats()?.map((stat: any) => (
                <StatCard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  icon={getIconComponent(stat.icon)}
                  description={stat.description}
                />
              )) || []}
            </div>
            {selectedCountry && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Showing stats for: {selectedCountryName || selectedCountry}
                </p>
                <button 
                  onClick={() => {
                    setSelectedCountry(null);
                    setSelectedCountryName(null);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  View global stats
                </button>
              </div>
            )}
          </div>

          {/* Right Section - Map Chart */}
          <div className="lg:col-span-8">
            <MapChart 
              onCountryClick={handleCountryClick} 
              countriesWithData={mapCountriesWithData}
            />
          </div>
        </div>

        {/* Bottom Section - Tables and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Influencer Table */}
          <div className="lg:col-span-4">
            <InfluencerTable 
              influencers={getCurrentInfluencers() || []} 
              itemsPerPage={5}
            />
          </div>
          
          {/* Age & Gender Chart */}
          <div className="lg:col-span-4">
            <AudienceAgeGenderChart
              title="Audience Age & Gender"
              data={getCurrentDemographics() || []}
            />
          </div>
          
          {/* Radar Chart - Visible on all devices */}
          <div className="lg:col-span-4">
            <RadarChart
              title="Follower Interest"
              data={getCurrentInterests() || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
