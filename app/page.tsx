'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import BarChart from '@/components/charts/BarChart';
import RadarChart from '@/components/charts/RadarChart';
import dynamic from 'next/dynamic';

const MapChart = dynamic(() => import('@/components/MapChart'), {
  ssr: false,
  loading: () => (
    <div className="p-4 flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Global User Distribution</h2>
      </div>
      <div className="flex items-center justify-center flex-1 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  )
});
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Eye,
  MousePointer
} from 'lucide-react';

// Static data
const statsData = [
  {
    title: 'Total Reach',
    value: '2.4M',
    change: { value: 12.5, type: 'increase' as const },
    icon: <Users className="w-6 h-6 text-primary" />,
    description: 'Unique users reached'
  },
  {
    title: 'Engagement Rate',
    value: '8.2%',
    change: { value: 2.1, type: 'increase' as const },
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    description: 'Average engagement'
  },
  {
    title: 'Revenue',
    value: '$127K',
    change: { value: 8.7, type: 'increase' as const },
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    description: 'Monthly revenue'
  },
  {
    title: 'Conversion Rate',
    value: '4.3%',
    change: { value: 1.2, type: 'decrease' as const },
    icon: <Target className="w-6 h-6 text-primary" />,
    description: 'Lead to customer'
  },
  {
    title: 'Page Views',
    value: '892K',
    change: { value: 15.3, type: 'increase' as const },
    icon: <Eye className="w-6 h-6 text-primary" />,
    description: 'Total page views'
  },
  {
    title: 'Click-through Rate',
    value: '2.8%',
    change: { value: 0.5, type: 'increase' as const },
    icon: <MousePointer className="w-6 h-6 text-primary" />,
    description: 'Average CTR'
  },
];

const demographicsData = [
  { label: '18-24', value: 28, color: 'rgb(59, 130, 246)' },
  { label: '25-34', value: 35, color: 'rgb(16, 185, 129)' },
  { label: '35-44', value: 22, color: 'rgb(245, 158, 11)' },
  { label: '45-54', value: 12, color: 'rgb(239, 68, 68)' },
  { label: '55+', value: 8, color: 'rgb(139, 92, 246)' },
];

const interestsData = [
  { label: 'Technology', value: 85 },
  { label: 'Business', value: 72 },
  { label: 'Marketing', value: 90 },
  { label: 'Design', value: 65 },
  { label: 'Finance', value: 58 },
  { label: 'Education', value: 78 },
];

const tabsData = [
  { id: 'overview', label: 'Overview', count: 12 },
  { id: 'performance', label: 'Performance', count: 8 },
  { id: 'audience', label: 'Audience', count: 24 },
  { id: 'insights', label: 'Insights', count: 5 },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-bg-secondary dashboard-bg">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          {/* Header */}
          <Header 
            title="Campaign Analytics" 
            status="Campaign is running smoothly" 
          />
          
          {/* Tabs */}
          <div className="mb-8">
            <Tabs tabs={tabsData} defaultTab="overview" />
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                description={stat.description}
              />
            ))}
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Demographics Chart */}
            <div className="lg:col-span-1">
              <BarChart 
                title="Audience Demographics"
                data={demographicsData}
              />
            </div>
            
            {/* Interests Radar Chart */}
            <div className="lg:col-span-1">
              <RadarChart 
                title="Follower Interests"
                data={interestsData}
              />
            </div>
            
            {/* Map Chart */}
            <div className="lg:col-span-1">
              <MapChart />
            </div>
          </div>
          
          {/* Additional Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-0">
              <h3 className="text-lg font-semibold text-text-primary mb-4 tech-accent">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', action: 'Campaign "Summer Sale" launched', status: 'success' },
                  { time: '4 hours ago', action: 'New audience segment created', status: 'info' },
                  { time: '6 hours ago', action: 'Analytics report generated', status: 'success' },
                  { time: '1 day ago', action: 'Budget threshold reached', status: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-bg-secondary transition-colors duration-200">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-success' :
                      activity.status === 'warning' ? 'bg-warning' :
                      activity.status === 'error' ? 'bg-error' : 'bg-info'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Top Performing Content */}
            <Card className="p-0">
              <h3 className="text-lg font-semibold text-text-primary mb-4 tech-accent">Top Performing Content</h3>
              <div className="space-y-4">
                {[
                  { title: 'Marketing Automation Guide', views: '12.4K', engagement: '8.2%' },
                  { title: 'Customer Success Stories', views: '9.8K', engagement: '6.7%' },
                  { title: 'Product Demo Video', views: '8.1K', engagement: '9.1%' },
                  { title: 'Industry Trends Report', views: '6.9K', engagement: '5.4%' },
                ].map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{content.title}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-text-muted mono">{content.views} views</span>
                        <span className="text-xs text-sky-600 mono">{content.engagement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}