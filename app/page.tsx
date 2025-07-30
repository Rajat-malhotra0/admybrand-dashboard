"use client";

import React, { useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import ConsolidatedHeader from "@/components/ConsolidatedHeader";
import ContentHeader from "@/components/ContentHeader";
import StatCard from "@/components/StatCard";
import AudienceAgeGenderChart from "@/components/AudienceAgeGenderChart";
import RadarChart from "@/components/charts/RadarChart";
import LeadTable from "@/components/LeadTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { ResponsiveGrid, ResponsiveGridItem } from "@/components/Layout/ResponsiveGrid";
import { useScreenSize } from "@/hooks/useScreenSize";
import { usePlatformData } from "@/hooks/usePlatformData";
import { useCountriesWithData } from "@/hooks/useCountriesWithData";
import { TrendingUp, Users, Eye, Target } from "lucide-react";
import dynamic from "next/dynamic";

import CampaignPerformanceWidget from "@/components/CampaignPerformanceWidget";

const MapChart = dynamic(() => import("@/components/MapChart"), {
  ssr: false,
});

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
  // Always use backend data - no toggle needed
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
  
  // Always use backend data
  const { data: platformData, error: platformError, isLoading: platformLoading, refresh } = usePlatformData(activeTab, true, selectedCountry ? (isoToDbCountryName[selectedCountry] || selectedCountry) : undefined);
  
  // Fetch countries with data from backend
  const { countries: countriesWithData, error: countriesError, isLoading: countriesLoading, refresh: refreshCountries } = useCountriesWithData();

  // Convert database country names to ISO codes for the map
  const mapCountriesWithData = countriesWithData.map(country => countryNameToIso[country] || country);

  // Track platform/country changes for debugging
  // SWR automatically fetches when the key changes, no manual refresh needed
  React.useEffect(() => {
    console.log('Platform/country changed:', { platform: activeTab, country: selectedCountry });
    // SWR will automatically fetch with the new key - no manual refresh needed
  }, [activeTab, selectedCountry]);
  const { isMobile, isTablet, isDesktop, screenSize } = useScreenSize();
  
  // Function to handle country selection
  const handleCountryClick = async (countryIso: string) => {
    console.log('Country selected (ISO):', countryIso);
    const dbCountryName = isoToDbCountryName[countryIso] || countryIso;
    
    setSelectedCountry(countryIso);
    setSelectedCountryName(isoToCountryName[countryIso] || countryIso);
    
    // Try to generate dynamic data for the selected country
    try {
      const response = await fetch(`http://localhost:5000/api/dynamic-data/generate/${dbCountryName}?platform=${activeTab}`);
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Generated dynamic data for ${dbCountryName}:`, result.data);
        // Refresh the platform data to show the new data
        refresh();
      } else {
        console.log(`ℹ️ No data available for ${dbCountryName}:`, result.message);
        // Still refresh to show "No data" state
        refresh();
      }
    } catch (error) {
      console.error('Error generating dynamic data:', error);
      // Still refresh to show current state (which may be "No data")
      refresh();
    }
  };
  
  const getCurrentStats = () => {
    return platformData?.campaignStats || [];
  };

  const getCurrentLeads = () => {
    return platformData?.leadData || [];
  };

  const getCurrentDemographics = () => {
    return platformData?.demographicsData || [];
  };

  const getCurrentInterests = () => {
    return platformData?.interestsData || [];
  };

  const shouldDisablePDF = platformLoading || countriesLoading;

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Campaign Performance Widget */}
          <CampaignPerformanceWidget 
            campaignStats={getCurrentStats()} 
            platform={activeTab}
            country={selectedCountryName || 'Global'}
            reportRef={reportRef}
            disabled={shouldDisablePDF}
          />

          {/* Map and Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <MapChart 
                onCountryClick={handleCountryClick} 
                countriesWithData={mapCountriesWithData}
              />
            </div>
            <div className="lg:col-span-4">
              <AudienceAgeGenderChart
                title="Audience Demographics"
                data={getCurrentDemographics() || []}
                showNoDataMessage={true}
              />
            </div>
          </div>

          {/* Leads and Interests */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <LeadTable 
                leads={getCurrentLeads() || []} 
                itemsPerPage={5}
                showNoDataMessage={true}
              />
            </div>
            <div className="lg:col-span-5">
              <RadarChart
                title="Top Follower Interests"
                data={getCurrentInterests() || []}
                showNoDataMessage={true}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
