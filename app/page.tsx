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

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="space-y-8 p-6 md:p-8">
        {/* Row 1 */}
        <header className="flex justify-between items-center">
          <ConsolidatedHeader />
        </header>

        {/* Row 2 */}
        <section className="flex justify-between items-center">
          <ContentHeader />
        </section>

        {/* Row 3 */}
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

        {/* Row 4 - Dashboard Grid with responsive 12-column layout */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-4 md:gap-6">
            {/* Sub-Row A - Top row with metric cards, wide card, and map */}

            {/* Four metric cards - responsive sizing */}
            {mockData.campaignStats?.map((stat) => (
              <div
                key={stat.id}
                className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2"
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={getIconComponent(stat.icon)}
                  description={stat.description}
                />
              </div>
            )) || []}

            {/* Campaign Reach card - responsive sizing */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4 min-h-[200px] lg:min-h-[240px]">
              <CampaignReach />
            </div>

            {/* Map card - responsive sizing with row-span on larger screens */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4 xl:row-span-2 h-[300px] lg:h-[400px]">
              <MapChart />
            </div>

            {/* Sub-Row B - Bottom row with three components */}

            {/* InfluencerTable - responsive sizing */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4 min-h-[300px]">
              <InfluencerTable influencers={mockData.influencerData || []} />
            </div>

            {/* AudienceAgeGenderChart - responsive sizing */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4 min-h-[300px]">
              <AudienceAgeGenderChart
                title="Audience Age & Gender"
                data={mockData.demographicsData || []}
              />
            </div>

            {/* RadarChart - responsive sizing */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 xl:col-span-4 min-h-[300px]">
              <RadarChart
                title="Follower Interest"
                data={mockData.interestsData || []}
              />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
