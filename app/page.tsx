'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ConsolidatedHeader from '@/components/ConsolidatedHeader';
import CampaignReach from '@/components/CampaignReach';
import StatCard from '@/components/StatCard';
import AudienceAgeGenderChart from '@/components/AudienceAgeGenderChart';
import RadarChart from '@/components/charts/RadarChart';
import InfluencerTable from '@/components/InfluencerTable';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapChart = dynamic(() => import('@/components/MapChart'), {
  ssr: false,
});

// Mock data to display the dashboard properly
const mockData = {
  campaignStats: [
    {
      id: 1,
      title: 'Total Reach',
      value: '2.4M',
      icon: 'TrendingUp',
      description: '+12% from last month'
    },
    {
      id: 2,
      title: 'Engagement',
      value: '18,439',
      icon: 'Users',
      description: '+4.2% from last week'
    },
    {
      id: 3,
      title: 'Impressions',
      value: '1.2M',
      icon: 'Eye',
      description: '+8.1% from last month'
    },
    {
      id: 4,
      title: 'Conversions',
      value: '542',
      icon: 'Target',
      description: '+16% from last month'
    }
  ],
  influencerData: [
    {
      id: 1,
      name: 'Sarah Johnson',
      projects: 12,
      followers: '2.4M'
    },
    {
      id: 2,
      name: 'Mike Chen',
      projects: 8,
      followers: '1.8M'
    },
    {
      id: 3,
      name: 'Alex Rivera',
      projects: 15,
      followers: '980K'
    }
  ],
  demographicsData: [
    { label: '18-24', male: 25, female: 30 },
    { label: '25-34', male: 35, female: 28 },
    { label: '35-44', male: 20, female: 25 },
    { label: '45-54', male: 12, female: 12 },
    { label: '55+', male: 8, female: 5 }
  ],
  interestsData: [
    { label: 'Fashion', value: 85 },
    { label: 'Beauty', value: 72 },
    { label: 'Lifestyle', value: 68 },
    { label: 'Tech', value: 45 },
    { label: 'Sports', value: 35 },
    { label: 'Travel', value: 52 }
  ]
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp />;
    case 'Users':
      return <Users />;
    case 'Eye':
      return <Eye />;
    case 'Target':
      return <Target />;
    default:
      return <TrendingUp />;
  }
};

export default function Dashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="p-6 md:p-8">
        {/* Consolidated Header */}
        <ConsolidatedHeader />
        
        {/* Main Content Grid - Match the image layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Section: Stats and Campaign Reach */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid - 2x2 layout */}
            <div className="grid grid-cols-2 gap-6">
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
            
            {/* Campaign Reach */}
            <CampaignReach />
          </div>
          
          {/* Right Section: World Map */}
          <div className="lg:col-span-1">
            <MapChart />
          </div>
        </div>
        
        {/* Bottom 3-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Influencer Table */}
          <div className="lg:col-span-1">
            <InfluencerTable influencers={mockData.influencerData || []} />
          </div>
          
          {/* Center Column: Audience Age & Gender */}
          <div className="lg:col-span-1">
            <AudienceAgeGenderChart 
              title="Audience Age & Gender"
              data={mockData.demographicsData || []}
            />
          </div>
          
          {/* Right Column: Follower Interests */}
          <div className="lg:col-span-1">
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
