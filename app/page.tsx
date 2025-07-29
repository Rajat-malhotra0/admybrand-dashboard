"use client";

import React, { useState } from "react";
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
import { TrendingUp, Users, Eye, Target } from "lucide-react";
import dynamic from "next/dynamic";

const MapChart = dynamic(() => import("@/components/MapChart"), {
  ssr: false,
});

// Mock data to display the dashboard properly
const mockData = {
  campaignStats: [
    {
      id: 1,
      title: "Total Reach",
      value: "2.4M",
      icon: "TrendingUp",
      description: "+12% from last month",
    },
    {
      id: 2,
      title: "Engagement",
      value: "18,439",
      icon: "Users",
      description: "+4.2% from last week",
    },
    {
      id: 3,
      title: "Impressions",
      value: "1.2M",
      icon: "Eye",
      description: "+8.1% from last month",
    },
    {
      id: 4,
      title: "Conversions",
      value: "542",
      icon: "Target",
      description: "+16% from last month",
    },
  ],
  influencerData: [
    {
      id: 1,
      name: "Sarah Johnson",
      projects: 12,
      followers: "2.4M",
    },
    {
      id: 2,
      name: "Mike Chen",
      projects: 8,
      followers: "1.8M",
    },
    {
      id: 3,
      name: "Alex Rivera",
      projects: 15,
      followers: "980K",
    },
  ],
  demographicsData: [
    { label: "18-24", male: 25, female: 30 },
    { label: "25-34", male: 35, female: 28 },
    { label: "35-44", male: 20, female: 25 },
    { label: "45-54", male: 12, female: 12 },
    { label: "55+", male: 8, female: 5 },
  ],
  interestsData: [
    { label: "Fashion", value: 85 },
    { label: "Beauty", value: 72 },
    { label: "Lifestyle", value: 68 },
    { label: "Tech", value: 45 },
    { label: "Sports", value: 35 },
    { label: "Travel", value: 52 },
  ],
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "TrendingUp":
      return <TrendingUp />;
    case "Users":
      return <Users />;
    case "Eye":
      return <Eye />;
    case "Target":
      return <Target />;
    default:
      return <TrendingUp />;
  }
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("TikTok");
  const tabs = ["TikTok", "Instagram", "Facebook"];
  const { isMobile, isTablet, isDesktop, screenSize } = useScreenSize();

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-full overflow-x-hidden space-y-4 lg:space-y-6">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <ConsolidatedHeader />
        </header>

        {/* Content Header */}
        <section className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <ContentHeader />
        </section>

        {/* Social Media Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 w-full lg:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 lg:flex-none font-medium rounded-md transition-colors 
                min-h-[44px] flex items-center justify-center
                px-3 py-2 text-sm lg:px-4
                ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Grid - Desktop: Stats left, Map right | Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Stats Cards (2x2 grid on desktop) */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockData.campaignStats?.map((stat) => (
                <StatCard
                  key={stat.id}
                  title={stat.title}
                  value={stat.value}
                  icon={getIconComponent(stat.icon)}
                  description={stat.description}
                />
              )) || []}
            </div>
          </div>

          {/* Right Section - Map Chart */}
          <div className="lg:col-span-8">
            <MapChart />
          </div>
        </div>

        {/* Bottom Section - Tables and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Influencer Table */}
          <div className="lg:col-span-4">
            <InfluencerTable influencers={mockData.influencerData || []} />
          </div>
          
          {/* Age & Gender Chart */}
          <div className="lg:col-span-4">
            <AudienceAgeGenderChart
              title="Audience Age & Gender"
              data={mockData.demographicsData || []}
            />
          </div>
          
          {/* Radar Chart - Visible on all devices */}
          <div className="lg:col-span-4">
            <RadarChart
              title="Follower Interest"
              data={mockData.interestsData || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
