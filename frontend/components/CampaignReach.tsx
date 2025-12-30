"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import Card from "./Card";

const CampaignReach: React.FC = () => {
  return (
    <Card hover>
      <div className="flex flex-col space-y-4 p-2">
        {/* Campaign Reach */}
        <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Campaign Reach</p>
          <p className="text-2xl font-bold text-text-primary tracking-tight">
            12
          </p>
          <p className="text-xs text-text-muted font-medium">Countries</p>
        </div>

        {/* Total Users */}
        <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">User Reached</p>
          <p className="text-2xl font-bold text-primary tracking-tight">
            180.8M
          </p>
          <p className="text-xs text-primary/70 font-medium">Unique Users</p>
        </div>

        {/* Period */}
        <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border/50">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Duration</p>
          <p className="text-2xl font-bold text-text-primary tracking-tight">
            9
          </p>
          <p className="text-xs text-text-muted font-medium">Months</p>
        </div>

        {/* Last Updated */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-text-muted mb-2 font-medium">Updated 2s ago</p>
          <button className="flex items-center justify-center space-x-1.5 text-primary hover:text-primary-dark transition-colors mx-auto px-3 py-1.5 rounded-full hover:bg-primary/5">
            <RefreshCw className="w-3 h-3" />
            <span className="text-xs font-semibold">Refresh Data</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CampaignReach;
