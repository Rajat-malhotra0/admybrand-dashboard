"use client";

import React, { useState } from "react";
import { ArrowLeft, MoreVertical, Circle } from "lucide-react";

interface CampaignHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ 
  activeTab = "LinkedIn", 
  onTabChange 
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);

  const tabs = ["LinkedIn", "Instagram", "Facebook"];
  
  // Use controlled tab if provided, otherwise use local state
  const currentTab = onTabChange ? activeTab : localActiveTab;
  
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalActiveTab(tab);
    }
  };

  return (
    <div className="mb-8">
      {/* Campaign Title Header */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg px-4 py-3 border border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">BC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Blue Chips Chicago
              </h1>
              <p className="text-sm text-gray-500">
                Diam nullam quis nunc et pretium augue
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Status</span>
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 text-green-500 fill-current" />
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CampaignHeader;
