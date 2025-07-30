"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  Eye, 
  Target,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  MapPin
} from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Sidebar from "@/components/Sidebar";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import Card from "@/components/Card";

// Dynamically import the chart components
const MapChart = dynamic(() => import("@/components/MapChart"), { ssr: false });
const AudienceAgeGenderChart = dynamic(() => import("@/components/AudienceAgeGenderChart"), { ssr: false });
const RadarChart = dynamic(() => import("@/components/charts/RadarChart"), { ssr: false });

interface DataSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  isExpanded: boolean;
}

export default function DataEditor() {
  const { 
    data, 
    updateCountryData, 
    updateCampaignStat, 
    updateInfluencer, 
    updateDemographic, 
    updateInterest, 
    addCountry,
    removeCountry,
    resetData 
  } = useDashboardData();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['countries', 'campaignStats'])
  );
  const [previewMode, setPreviewMode] = useState(false);

  const sections: DataSection[] = [
    {
      id: 'countries',
      title: 'Geographic Data',
      icon: <MapPin className="w-5 h-5 text-primary" />,
      description: 'Manage country-specific user data and metrics',
      isExpanded: expandedSections.has('countries')
    },
    {
      id: 'campaignStats',
      title: 'Campaign Statistics',
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      description: 'Update key performance indicators and metrics',
      isExpanded: expandedSections.has('campaignStats')
    },
    {
      id: 'influencers',
      title: 'Influencer Data',
      icon: <Users className="w-5 h-5 text-primary" />,
      description: 'Modify influencer profiles and statistics',
      isExpanded: expandedSections.has('influencers')
    },
    {
      id: 'demographics',
      title: 'Demographics',
      icon: <PieChart className="w-5 h-5 text-primary" />,
      description: 'Adjust age and gender distribution data',
      isExpanded: expandedSections.has('demographics')
    },
    {
      id: 'interests',
      title: 'Interest Categories',
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      description: 'Update audience interest and engagement levels',
      isExpanded: expandedSections.has('interests')
    }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "TrendingUp": return <TrendingUp className="w-4 h-4 text-primary" />;
      case "Users": return <Users className="w-4 h-4 text-primary" />;
      case "Eye": return <Eye className="w-4 h-4 text-primary" />;
      case "Target": return <Target className="w-4 h-4 text-primary" />;
      default: return <TrendingUp className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Data Editor
            </h1>
            <p className="text-gray-600 mt-2">
              Modify dashboard data in real-time to see instant changes across all visualizations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                previewMode 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              Reset All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Editor Panel */}
          <div className="lg:col-span-1 space-y-6">
            {sections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  {section.isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {section.isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {/* Countries Section */}
                    {section.id === 'countries' && (
                      <div className="space-y-3">
                        {data.countries.map((country) => (
                          <div key={country.id} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {country.name}
                              </label>
                              <input
                                type="number"
                                value={country.value}
                                onChange={(e) => updateCountryData(country.id, parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="User count"
                              />
                            </div>
                            <button
                              onClick={() => removeCountry(country.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Campaign Stats Section */}
                    {section.id === 'campaignStats' && (
                      <div className="space-y-3">
                        {data.campaignStats.map((stat) => (
                          <div key={stat.id} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              {getIconComponent(stat.icon)}
                              <span className="font-medium text-gray-900">{stat.title}</span>
                            </div>
                            <input
                              type="number"
                              value={stat.rawValue || 0}
                              onChange={(e) => updateCampaignStat(stat.id, 'rawValue', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Raw value"
                            />
                            <input
                              type="text"
                              value={stat.description}
                              onChange={(e) => updateCampaignStat(stat.id, 'description', e.target.value)}
                              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Description"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Influencers Section */}
                    {section.id === 'influencers' && (
                      <div className="space-y-3">
                        {data.influencers.map((influencer) => (
                          <div key={influencer.id} className="bg-white p-3 rounded-lg">
                            <input
                              type="text"
                              value={influencer.name}
                              onChange={(e) => updateInfluencer(influencer.id, 'name', e.target.value)}
                              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Name"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                value={influencer.projects}
                                onChange={(e) => updateInfluencer(influencer.id, 'projects', parseInt(e.target.value) || 0)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Projects"
                              />
                              <input
                                type="number"
                                value={influencer.followersCount || 0}
                                onChange={(e) => updateInfluencer(influencer.id, 'followersCount', parseInt(e.target.value) || 0)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Followers"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {/* Note about pagination */}
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                          💡 The InfluencerTable component includes pagination when more than 5 influencers are present.
                        </div>
                      </div>
                    )}

                    {/* Demographics Section */}
                    {section.id === 'demographics' && (
                      <div className="space-y-3">
                        {data.demographics.map((demo) => (
                          <div key={demo.label} className="bg-white p-3 rounded-lg">
                            <div className="font-medium text-gray-900 mb-2">{demo.label}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Male</label>
                                <input
                                  type="number"
                                  value={demo.male}
                                  onChange={(e) => updateDemographic(demo.label, 'male', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Female</label>
                                <input
                                  type="number"
                                  value={demo.female}
                                  onChange={(e) => updateDemographic(demo.label, 'female', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Interests Section */}
                    {section.id === 'interests' && (
                      <div className="space-y-3">
                        {data.interests.map((interest) => (
                          <div key={interest.label} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{interest.label}</span>
                              <span className="text-sm text-gray-600">{interest.value}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={interest.value}
                              onChange={(e) => updateInterest(interest.label, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-green-600" />
              Live Preview
            </h2>
            
            {/* Map Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
              <div className="h-96">
                <MapChart />
              </div>
            </Card>

            {/* Demographics Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Demographics</h3>
              <div className="h-64">
                <AudienceAgeGenderChart 
                  title="Audience Age & Gender" 
                  data={data.demographics} 
                />
              </div>
            </Card>

            {/* Interests Radar Chart */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Audience Interests</h3>
              <div className="h-64">
                <RadarChart 
                  title="Follower Interest" 
                  data={data.interests} 
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
