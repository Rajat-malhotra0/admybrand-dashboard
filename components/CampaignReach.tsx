"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import Card from "./Card";

const CampaignReach: React.FC = () => {
  return (
    <Card hover>
      <div className="flex flex-col space-y-3 p-2">
        {/* Campaign Reach */}
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Campaign Reach</p>
          <p className="text-lg font-bold text-gray-900">
            12
          </p>
          <p className="text-xs text-gray-500">country</p>
        </div>

        {/* Total Users */}
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">User Reached</p>
          <p className="text-lg font-bold text-gray-900">
            180,807,839
          </p>
          <p className="text-xs text-gray-500">user</p>
        </div>

        {/* Period */}
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Period</p>
          <p className="text-lg font-bold text-gray-900">
            9
          </p>
          <p className="text-xs text-gray-500">month</p>
        </div>

        {/* Last Updated */}
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Updated 2s ago</p>
          <button className="flex items-center justify-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors mx-auto">
            <RefreshCw className="w-3 h-3" />
            <span className="text-xs">Click to refresh</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CampaignReach;
