"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import Card from "./Card";

const CampaignReach: React.FC = () => {
  return (
    <Card hover>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {/* Campaign Reach */}
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-xs">Campaign Reach</p>
          <p className="text-xl md:text-2xl font-bold text-text-primary mono">
            12
          </p>
          <p className="text-xs md:text-sm text-text-muted">country</p>
        </div>

        {/* Total Users */}
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-xs">Total Users</p>
          <p className="text-xl md:text-2xl font-bold text-text-primary mono">
            180,807,839
          </p>
          <p className="text-xs md:text-sm text-text-muted">user</p>
        </div>

        {/* Period */}
        <div className="text-center">
          <p className="text-sm text-text-secondary mb-xs">Period</p>
          <p className="text-xl md:text-2xl font-bold text-text-primary mono">
            9
          </p>
          <p className="text-xs md:text-sm text-text-muted">month</p>
        </div>

        {/* Last Updated */}
        <div className="text-center col-span-2 md:col-span-1">
          <p className="text-sm text-text-secondary mb-xs">Updated 2s ago</p>
          <button className="flex items-center justify-center space-x-2 text-primary hover:text-primary-dark transition-colors mx-auto">
            <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">Click to refresh</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CampaignReach;
