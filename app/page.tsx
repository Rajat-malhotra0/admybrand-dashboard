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
      title: "Total Likes",
      value: "350,809",
      icon: "TrendingUp",
      description: "Total Likes",
    },
    {
      id: 2,
      title: "Total Comments",
      value: "186,072",
      icon: "Users",
      description: "Total Comments",
    },
    {
      id: 3,
      title: "Campaign Reach",
      value: "180,807,839 User",
      icon: "Eye",
      description: "Campaign Reach",
    },
    {
      id: 4,
      title: "Total Shares",
      value: "120,043",
      icon: "Target",
      description: "Total Shares",
    },
    {
      id: 5,
      title: "Engagement",
      value: "48.07%",
      icon: "Target",
      description: "Engagement",
    },
  ],
  influencerData: [
    {
      id: 1,
      name: "Name........",
      projects: 12,
      followers: "1.6M",
    },
    {
      id: 2,
      name: "Name........",
      projects: 8,
      followers: "1.2M",
    },
    {
      id: 3,
      name: "Name........",
      projects: 15,
      followers: "1.1M",
    },
    {
      id: 4,
      name: "Name........",
      projects: 7,
      followers: "927k",
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

        {/* Main Content - Dashboard layout based on the image */}
        <section>
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Campaign Info and Stats */}
            <div className="col-span-12 lg:col-span-8">
              {/* Campaign Header */}
              <div className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      Blue Chips Chicago
                    </h2>
                    <p className="text-gray-600">Diam nullam quis nunc...</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status: [Active]</p>
                    <p className="text-sm text-gray-500">
                      Created on: August 20...
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Platforms Tabs */}
              <div className="flex space-x-1 border-b mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Stats Grid - 2 rows, 3 columns for first 4, then 2 columns for last row */}
              <div className="grid grid-cols-3 gap-4">
                {/* First row - 3 columns */}
                <div className="p-4 border rounded-md text-center">
                  <h3 className="text-sm font-semibold mb-2">Total Likes</h3>
                  <p className="text-xl font-bold">350,809</p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <h3 className="text-sm font-semibold mb-2">Total Comments</h3>
                  <p className="text-xl font-bold">186,072</p>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <h3 className="text-sm font-semibold mb-2">Campaign Reach</h3>
                  <p className="text-lg font-bold">180,807,839 User</p>
                </div>

                {/* Second row - 2 columns centered */}
                <div className="col-start-1 col-end-3 grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md text-center">
                    <h3 className="text-sm font-semibold mb-2">Total Shares</h3>
                    <p className="text-xl font-bold">120,043</p>
                  </div>
                  <div className="p-4 border rounded-md text-center">
                    <h3 className="text-sm font-semibold mb-2">Engagement</h3>
                    <p className="text-xl font-bold">48.07%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - World Map */}
            <div className="col-span-12 lg:col-span-4 ">
              <div className="h-full p-4 border rounded-md">
                <h3 className="text-lg font-bold mb-4 text-center">
                  ## WORLD MAP ##
                </h3>
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">World Map Visualization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Influencers and Demographics */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            {/* Influencer Table */}
            <div className="col-span-12 md:col-span-7">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-bold">Influencer</h3>
                <InfluencerTable influencers={mockData.influencerData || []} />
              </div>
            </div>

            {/* Audience Age & Gender and Follower Interest Charts */}
            <div className="col-span-12 md:col-span-5 grid grid-cols-1 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-bold">Audience Age & Gender</h3>
                <AudienceAgeGenderChart
                  title="Audience Age & Gender"
                  data={mockData.demographicsData || []}
                />
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="text-lg font-bold">Follower Interest</h3>
                <RadarChart
                  title="Follower Interest"
                  data={mockData.interestsData || []}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
