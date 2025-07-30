"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ConsolidatedHeader from "@/components/ConsolidatedHeader";
import ContentHeader from "@/components/ContentHeader";
import CampaignReach from "@/components/CampaignReach";
import StatCard from "@/components/StatCard";
import AudienceAgeGenderChart from "@/components/AudienceAgeGenderChart";
import RadarChart from "@/components/charts/RadarChart";
import InfluencerTable from "@/components/InfluencerTable";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { TrendingUp, Users, Eye, Target, ThumbsUp, MessageSquare, Share, BarChart2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useDashboardData } from "@/hooks/useDashboardData";

const MapChart = dynamic(() => import("@/components/MapChart"), {
  ssr: false,
});

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "TrendingUp":
    case "trending-up":
      return <TrendingUp className="text-primary" />;
    case "Users":
    case "users":
      return <Users className="text-primary" />;
    case "Eye":
    case "eye":
      return <Eye className="text-primary" />;
    case "Target":
    case "target":
      return <Target className="text-primary" />;
    case "thumbs-up":
      return <ThumbsUp className="text-primary" />;
    case "message-square":
      return <MessageSquare className="text-primary" />;
    case "share":
      return <Share className="text-primary" />;
    case "bar-chart-2":
      return <BarChart2 className="text-primary" />;
    default:
      return <TrendingUp className="text-primary" />;
  }
};

// Transform API demographics data to the format expected by AudienceAgeGenderChart
const transformDemographicsData = (apiData: any[]) => {
  // Since the API returns single values, we'll split them as male/female for the chart
  return apiData.map((item, index) => ({
    label: item.label,
    male: Math.floor(item.value * 0.6), // Approximate split
    female: Math.floor(item.value * 0.4),
  }));
};

export default function DashboardWithApi() {
  const [activeTab, setActiveTab] = useState("TikTok");
  const tabs = ["TikTok", "Instagram", "Facebook"];
  
  const { data, error, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600">Failed to connect to the backend API</p>
            <details className="mt-4 text-sm text-gray-500">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-left bg-gray-100 p-2 rounded">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout sidebar={<Sidebar />}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <ConsolidatedHeader />
        </header>

        {/* Content Header */}
        <section className="flex justify-between items-center">
          <ContentHeader />
        </section>

        {/* Social Media Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Top Row - Stats Cards in 2x2 Grid (smaller) */}
          <div className="col-span-4 grid grid-cols-2 grid-rows-2 gap-3">
            {data.campaignStats?.map((stat) => (
              <div key={stat.id} className="col-span-1">
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={getIconComponent(stat.icon)}
                  description={stat.description}
                />
              </div>
            )) || []}
          </div>

          {/* Right Side - Campaign Reach and Map */}
          <div className="col-span-8 grid grid-cols-2 gap-4">
            {/* Campaign Reach */}
            <div className="col-span-1">
              <CampaignReach />
            </div>
            
            {/* Map Card */}
            <div className="col-span-1">
              <div className="h-[400px]">
                <MapChart />
              </div>
            </div>
          </div>

          {/* Bottom Row - Three Components */}
          <div className="col-span-4">
            <InfluencerTable 
              influencers={data.influencerData || []} 
              itemsPerPage={5}
            />
          </div>
          <div className="col-span-4">
            <AudienceAgeGenderChart
              title="Audience Age & Gender"
              data={transformDemographicsData(data.demographicsData || [])}
            />
          </div>
          <div className="col-span-4">
            <RadarChart
              title="Follower Interest"
              data={data.interestsData || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
