"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import Card from "./Card";
import MapChart from "./MapChart";
import * as d3 from "d3";

interface CountryStats {
  id: string;
  name: string;
  userCount: number;
}

// Sample country statistics for choropleth visualization
const countryStats: CountryStats[] = [
  { id: "CAN", name: "Canada", userCount: 87142 },
  { id: "DEU", name: "Germany", userCount: 90069 },
  { id: "IDN", name: "Indonesia", userCount: 120904 },
  { id: "URY", name: "Uruguay", userCount: 85321 },
];

const MapWithCampaignReach: React.FC = () => {
  return (
    <Card hover>
      <div className="flex h-[400px]">
        {/* Campaign Reach Data - Left Side */}
        <div className="w-48 flex flex-col justify-center space-y-4 p-6 border-r border-gray-200">
          {/* Campaign Reach */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Campaign Reach</p>
            <p className="text-xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-400">country</p>
          </div>

          {/* User Reached */}
          <div>
            <p className="text-xs text-gray-500 mb-1">User Reached</p>
            <p className="text-xl font-bold text-gray-900">180,807,839</p>
            <p className="text-xs text-gray-400">user</p>
          </div>

          {/* Period */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Period</p>
            <p className="text-xl font-bold text-gray-900">9</p>
            <p className="text-xs text-gray-400">month</p>
          </div>

          {/* Last Updated */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Updated 2s ago</p>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-xs">
              <RefreshCw className="w-3 h-3" />
              <span>Click to refresh</span>
            </button>
          </div>
        </div>

        {/* Map Chart - Right Side */}
        <div className="flex-1 relative">
          <div className="absolute inset-0">
            <MapChart />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapWithCampaignReach;
